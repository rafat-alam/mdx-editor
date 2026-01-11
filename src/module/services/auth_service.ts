import { randomInt } from "crypto";
import { sign, SignOptions, verify } from "jsonwebtoken";
import { v4 } from "uuid";
import { User } from "../entities/user";
import { UserRepo } from "../repo/user_repo";
import { HelperService } from "./helper_service";

interface Response {
  status: number;
  message: string;
}

interface DecodedToken {
  temp_user: User;
  otp: string;
  otp_expiry: number;
}

interface ResetToken {
  email: string;
  otp: string;
  otp_expiry: number;
  can_reset: boolean;
}

interface VerifiedResetToken {
  email: string;
  can_reset: boolean;
}

const INTERNAL_SERVER_ERROR = "INTERNAL SERVER ERROR!";
const OTP_EXPIRY_DURATION = 10 * 60 * 1000; // 10 minutes
const SIGNUP_TOKEN_EXPIRY = '15m';
const RESET_TOKEN_EXPIRY = '5m';

export class AuthService {
  private static get_jwt_secret(): string {
    return process.env.JWT_SECRET ?? 'rafat';
  }

  private static generate_otp(): string {
    return randomInt(100000, 999999).toString();
  }

  private static send_otp(otp: string): void {
    // TODO: Implement actual OTP sending (email/sms)
    console.log(otp);
  }

  private static create_token(payload: any, expiry: string): string {
    const options: SignOptions = { expiresIn: expiry as SignOptions["expiresIn"] };
    return sign(payload, this.get_jwt_secret(), options);
  }

  private static verify_token<T>(token: string): T | null {
    try {
      return verify(token, this.get_jwt_secret()) as T;
    } catch {
      return null;
    }
  }

  static async init_signup(username: string, name: string, email: string, password: string): Promise<Response> {
    try {
      if (await UserRepo.find_by_username(username)) {
        return { status: 400, message: 'Username already taken!' };
      }

      if (await UserRepo.find_by_email(email)) {
        return { status: 400, message: 'Email already used!' };
      }

      const user_id = v4();
      const password_hash = HelperService.hash(password);
      const temp_user = new User(user_id, username, name, email, password_hash);

      const otp = this.generate_otp();
      const otp_expiry = Date.now() + OTP_EXPIRY_DURATION;

      this.send_otp(otp);

      const payload: DecodedToken = { temp_user, otp, otp_expiry };
      const token = this.create_token(payload, SIGNUP_TOKEN_EXPIRY);

      return { status: 200, message: token };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async resend_otp(token: string): Promise<Response> {
    try {
      const decoded = this.verify_token<DecodedToken>(token);
      if (!decoded) {
        return { status: 401, message: 'Invalid or expired token!' };
      }

      if (decoded.otp_expiry >= Date.now()) {
        const time_remaining = HelperService.format_time(decoded.otp_expiry - Date.now());
        return { status: 400, message: `OTP sent recently, try again in ${time_remaining} mins!` };
      }

      const otp = this.generate_otp();
      const otp_expiry = Date.now() + OTP_EXPIRY_DURATION;

      this.send_otp(otp);

      const payload: DecodedToken = { temp_user: decoded.temp_user, otp, otp_expiry };
      const new_token = this.create_token(payload, SIGNUP_TOKEN_EXPIRY);

      return { status: 200, message: new_token };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async verify_otp(token: string, otp: string): Promise<Response> {
    try {
      const decoded = this.verify_token<DecodedToken>(token);
      if (!decoded) {
        return { status: 401, message: 'Invalid or expired token!' };
      }

      if (decoded.otp !== otp) {
        return { status: 400, message: 'Invalid OTP!' };
      }

      if (decoded.otp_expiry < Date.now()) {
        return { status: 400, message: 'OTP expired!' };
      }

      if (await UserRepo.find_by_username(decoded.temp_user.username)) {
        return { status: 401, message: 'Username already taken!' };
      }

      if (await UserRepo.find_by_email(decoded.temp_user.email)) {
        return { status: 401, message: 'Email already used!' };
      }

      await UserRepo.create(decoded.temp_user);

      return { status: 200, message: 'User verified and created successfully!' };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async init_forgot_password(email: string): Promise<Response> {
    try {
      if (!(await UserRepo.find_by_email(email))) {
        return { status: 400, message: 'User not registered!' };
      }

      const otp = this.generate_otp();
      const otp_expiry = Date.now() + OTP_EXPIRY_DURATION;

      this.send_otp(otp);

      const payload: ResetToken = { email, otp, otp_expiry, can_reset: false };
      const token = this.create_token(payload, SIGNUP_TOKEN_EXPIRY);

      return { status: 200, message: token };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async resend_reset_otp(token: string): Promise<Response> {
    try {
      const decoded = this.verify_token<ResetToken>(token);
      if (!decoded) {
        return { status: 401, message: 'Invalid or expired token!' };
      }

      if (decoded.otp_expiry >= Date.now()) {
        const time_remaining = HelperService.format_time(decoded.otp_expiry - Date.now());
        return { status: 400, message: `OTP sent recently, try again in ${time_remaining} mins!` };
      }

      const otp = this.generate_otp();
      const otp_expiry = Date.now() + OTP_EXPIRY_DURATION;

      this.send_otp(otp);

      const payload: ResetToken = { email: decoded.email, otp, otp_expiry, can_reset: false };
      const new_token = this.create_token(payload, SIGNUP_TOKEN_EXPIRY);

      return { status: 200, message: new_token };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async verify_reset_otp(token: string, otp: string): Promise<Response> {
    try {
      const decoded = this.verify_token<ResetToken>(token);
      if (!decoded) {
        return { status: 401, message: 'Invalid or expired token!' };
      }

      if (decoded.otp !== otp) {
        return { status: 400, message: 'Invalid OTP!' };
      }

      if (decoded.otp_expiry < Date.now()) {
        return { status: 400, message: 'OTP expired!' };
      }

      const payload: VerifiedResetToken = { email: decoded.email, can_reset: true };
      const new_token = this.create_token(payload, RESET_TOKEN_EXPIRY);

      return { status: 200, message: new_token };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async set_password(token: string, password: string): Promise<Response> {
    try {
      const decoded = this.verify_token<VerifiedResetToken>(token);
      if (!decoded) {
        return { status: 401, message: 'Invalid or expired token!' };
      }

      if (!decoded.can_reset) {
        return { status: 401, message: 'OTP not verified' };
      }

      if (!(await UserRepo.find_by_email(decoded.email))) {
        return { status: 401, message: 'User not found!' };
      }

      const password_hash = HelperService.hash(password);
      await UserRepo.update_password(decoded.email, password_hash);

      return { status: 200, message: 'Password updated successfully!' };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async init_change_email(email: string): Promise<Response> {
    try {
      if (await UserRepo.find_by_email(email)) {
        return { status: 400, message: 'E-Mail already used!' };
      }

      const otp = this.generate_otp();
      const otp_expiry = Date.now() + OTP_EXPIRY_DURATION;

      this.send_otp(otp);

      const payload: ResetToken = { email, otp, otp_expiry, can_reset: false };
      const token = this.create_token(payload, SIGNUP_TOKEN_EXPIRY);

      return { status: 200, message: token };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }

  static async set_email(token: string, user_id: string): Promise<Response> {
    try {
      const decoded = this.verify_token<VerifiedResetToken>(token);
      if (!decoded) {
        return { status: 401, message: 'Invalid or expired token!' };
      }

      if (!decoded.can_reset) {
        return { status: 401, message: 'OTP not verified' };
      }

      if (await UserRepo.find_by_email(decoded.email)) {
        return { status: 401, message: 'E-Mail already used!' };
      }

      await UserRepo.update_email(user_id, decoded.email);

      return { status: 200, message: 'E-Mail updated successfully!' };
    } catch {
      return { status: 500, message: INTERNAL_SERVER_ERROR };
    }
  }
}
