import { randomBytes, scryptSync } from "crypto";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

interface Response {
  message: string;
  status: number;
}

export class HelperService {
  static email_regex = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\]))$/;

  static name_regex = /^[A-Za-z ]{5,256}$/;

  static username_regex = /^[a-z0-9_-]{5,256}$/;

  static password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,256}$/;

  static node_name_regex = /^[A-Za-z0-9_-]{1,256}$/;

  static otp_regex = /^[0-9]{6}$/;

  static email_format_msg = "Enter a valid E-Mail address.";

  static name_format_msg = "Name should have at least 5 characters and may contain only [a-z, 0-9, -, _].";

  static username_format_msg = "Username should have at least 5 characters and may contain only [A-Z, a-z, space].";

  static password_format_msg = "Password must be at least 8 characters and must include at least one uppercase letter, one lowercase letter, one number, and one special character.";

  static node_name_format_msg = "Name should have at least 1 characters and may contain only [a-z, 0-9, -, _].";

  static otp_format_msg = "Invalid OTP!";

  static DEFAULT_CONTENT = '# Hello, MDX!\n\nThis is a sample MDX document.\n\n```js\nconsole.log("Hello world");\n```\n\n## Features\n\n- **Bold text** and *italic text*\n- Lists and code blocks\n- And more!';

  static check_email(email: string): Response {
    if(this.email_regex.test(email)) {
      return { message: "OK!", status: 200 };
    }
    return { message: this.email_format_msg, status: 400 };
  }

  static check_name(name: string): Response {
    if(this.name_regex.test(name)) {
      return { message: "OK!", status: 200 };
    }
    return { message: this.name_format_msg, status: 400 };
  }

  static check_username(username: string): Response {
    if(this.username_regex.test(username)) {
      return { message: "OK!", status: 200 };
    }
    return { message: this.username_format_msg, status: 400 };
  }

  static check_password(password: string): Response {
    if(this.password_regex.test(password)) {
      return { message: "OK!", status: 200 };
    }
    return { message: this.password_format_msg, status: 400 };
  }

  static check_node_name(node_name: string): Response {
    if(this.node_name_regex.test(node_name)) {
      return { message: "OK!", status: 200 };
    }
    return { message: this.node_name_format_msg, status: 400 };
  }

  static check_otp(otp: string): Response {
    if(this.otp_regex.test(otp)) {
      return { message: "OK!", status: 200 };
    }
    return { message: this.otp_format_msg, status: 400 };
  }

  static async check_auth(req: NextRequest): Promise<Response> {
    const secret = process.env.NEXTAUTH_SECRET ?? 'rafat';

    const jwt_token = await getToken({ req, secret });
    if (!jwt_token || !jwt_token.user_id) {
      return { message: 'User not authenticated!', status: 401 };
    }

    return { message: "OK!", status: 400}
  }

  static hash(password: string): string {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
  }

  static verify(password: string, stored: string): boolean {
    const [salt, hash] = stored.split(":");
    const verifyHash = scryptSync(password, salt, 64).toString("hex");
    return hash === verifyHash;
  }

  static format_time(ms: number): string {
    const total_seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(total_seconds / 60);
    const seconds = total_seconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }
}
