import { randomInt } from "crypto";
import { sign, verify } from "jsonwebtoken";
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

const iserror: string = "INTERNAL SERVER ERROR!";

export class AuthService {
  static async init_signup(username: string, name: string, email: string, password: string): Promise<Response> {
    try {
      if (await UserRepo.find_by_username(username)) {
        return { status: 400, message: 'Username already taken!' };
      }

      if (await UserRepo.find_by_email(email)) {
        return { status: 400, message: 'Email already used!' };
      }

      const userId = v4();
      const password_hash = HelperService.hash(password);

      const temp_user = new User(userId, username, name, email, password_hash);

      const otp = randomInt(100000, 999999).toString();
      const otp_expiry = Date.now() + 10 * 60 * 1000;

      // send OTP here (email/sms)
      console.log(otp);

      const payload = { temp_user, otp, otp_expiry };

      const secret: string = process.env.JWT_SECRET ?? 'rafat';
      const token = sign(payload, secret, { expiresIn: '15m' });

      return { status: 200, message: token };
    } catch {
      return { status: 500, message: iserror };
    }
  }

  static async resend_otp(token: string): Promise<Response> {
    try {
      const secret: string = process.env.JWT_SECRET ?? 'rafat';

      let decoded: DecodedToken;
      try {
        decoded = verify(token, secret) as DecodedToken;
      } catch {
        return { status: 401, message: 'Invalid or expired token!' };
      }

      if (decoded.otp_expiry >= Date.now()) {
        return { status: 400, message: `OTP sent recently, try again in ${HelperService.format_time(decoded.otp_expiry - Date.now())} mins!` };
      }

      const otp = randomInt(100000, 999999).toString();
      const otp_expiry = Date.now() + 10 * 60 * 1000;

      // send OTP here (email/sms)
      console.log(otp);

      const payload = { temp_user: decoded.temp_user, otp, otp_expiry };
      const new_token = sign(payload, secret, { expiresIn: '15m' });

      return { status: 200, message: new_token };
    } catch {
      return { status: 500, message: iserror };
    }
  }

  static async verify_otp(token: string, otp: string): Promise<Response> {
    try {
      const secret: string = process.env.JWT_SECRET ?? 'rafat';

      let decoded: DecodedToken;
      try {
        decoded = verify(token, secret) as DecodedToken;
      } catch {
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

      if (await UserRepo.find_by_email(decoded.temp_user.username)) {
        return { status: 401, message: 'Email already used!' };
      }

      await UserRepo.create(decoded.temp_user);

      return { status: 200, message: 'User verified and created successfully!' };

    } catch {
      return { status: 500, message: iserror };
    }
  }

  static async init_forgot_pass(email: string): Promise<Response> {
    try {
      if ((await UserRepo.find_by_email(email)) == false) {
        return { status: 400, message: 'User not registered!' };
      }

      const otp = randomInt(100000, 999999).toString();
      const otp_expiry = Date.now() + 10 * 60 * 1000;

      // send OTP here (email/sms)
      console.log(otp);

      const payload = { email, otp, otp_expiry, can_reset: false };

      const secret: string = process.env.JWT_SECRET ?? 'rafat';
      const token = sign(payload, secret, { expiresIn: '15m' });

      return { status: 200, message: token };
    } catch {
      return { status: 500, message: iserror };
    }
  }

  static async forgot_pass_or_change_email_resend_otp(token: string): Promise<Response> {
    try {
      const secret: string = process.env.JWT_SECRET ?? 'rafat';

      let decoded: ResetToken;
      try {
        decoded = verify(token, secret) as ResetToken;
      } catch {
        return { status: 401, message: 'Invalid or expired token!' };
      }

      if (decoded.otp_expiry >= Date.now()) {
        return { status: 400, message: `OTP sent recently, try again in ${HelperService.format_time(decoded.otp_expiry - Date.now())} mins!` };
      }

      const otp = randomInt(100000, 999999).toString();
      const otp_expiry = Date.now() + 10 * 60 * 1000;

      // send OTP here (email/sms)
      console.log(otp);

      const payload = { email: decoded.email, otp, otp_expiry, can_reset: false };
      const new_token = sign(payload, secret, { expiresIn: '15m' });

      return { status: 200, message: new_token }
    } catch {
      return { status: 500, message: iserror };
    }
  }

  static async forgot_pass_or_change_email_verify_otp(token: string, otp: string): Promise<Response> {
    try {
      const secret: string = process.env.JWT_SECRET ?? 'rafat';

      let decoded: ResetToken;
      try {
        decoded = verify(token, secret) as ResetToken;
      } catch {
        return { status: 401, message: 'Invalid or expired token!' };
      }
      
      if (decoded.otp !== otp) {
        return { status: 400, message: 'Invalid OTP!' };
      }

      if (decoded.otp_expiry < Date.now()) {
        return { status: 400, message: 'OTP expired!' };
      }

      const payload = { email: decoded.email, can_reset: true };
      const new_token = sign( payload , secret, { expiresIn: '5m' });

      return { status: 200, message: new_token };
    } catch {
      return { status: 500, message: iserror };
    }
  }

  static async set_pass(token: string, password: string): Promise<Response> {
    try {
      const secret: string = process.env.JWT_SECRET ?? 'rafat';

      let decoded: VerifiedResetToken;
      try {
        decoded = verify(token, secret) as VerifiedResetToken;
      } catch {
        return { status: 401, message: 'Invalid or expired token!' };
      }

      if (!decoded.can_reset) {
        return { status: 401, message: 'OTP not verified' };
      }

      if ((await UserRepo.find_by_email(decoded.email)) == false) {
        return { status: 401, message: 'User not found!' };
      }

      const password_hash = HelperService.hash(password);

      await UserRepo.update_password(decoded.email, password_hash);

      return { status: 200, message:'Password updated successfully!' };
    } catch {
      return { status: 500, message: iserror };
    }
  }

  static async init_change_email(email: string): Promise<Response> {
    try {
      if (await UserRepo.find_by_email(email)) {
        return { status: 400, message: 'E-Mail already used!' };
      }

      const otp = randomInt(100000, 999999).toString();
      const otp_expiry = Date.now() + 10 * 60 * 1000;

      // send OTP here (email/sms)
      console.log(otp);

      const payload = { email, otp, otp_expiry, can_reset: false };

      const secret: string = process.env.JWT_SECRET ?? 'rafat';
      const token = sign(payload, secret, { expiresIn: '15m' });

      return { status: 200, message: token };
    } catch {
      return { status: 500, message: iserror };
    }
  }

  static async set_email(token: string, user_id: string): Promise<Response> {
    try {
      const secret: string = process.env.JWT_SECRET ?? 'rafat';

      let decoded: VerifiedResetToken;
      try {
        decoded = verify(token, secret) as VerifiedResetToken;
      } catch {
        return { status: 401, message: 'Invalid or expired token!' };
      }

      if (!decoded.can_reset) {
        return { status: 401, message: 'OTP not verified' };
      }

      if (await UserRepo.find_by_email(decoded.email)) {
        return { status: 401, message: 'E-Mail already used!' };
      }

      await UserRepo.update_email(user_id, decoded.email);

      return { status: 200, message:'E-Mail updated successfully!' };
    } catch {
      return { status: 500, message: iserror };
    }
  }
}
