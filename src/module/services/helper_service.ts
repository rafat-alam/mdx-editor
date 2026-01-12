import { randomBytes, scryptSync } from "crypto";

export class HelperService {
  static email_regex = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\]))$/;

  static name_regex = /^[A-Za-z ]{5,256}$/;

  static username_regex = /^[a-z0-9_-]{5,256}$/;

  static password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,256}$/;

  static repo_name_regex = /^[A-Za-z0-9_-]{1,256}$/;

  static folder_name_regex = /^[A-Za-z0-9_-]{1,256}$/;

  static file_name_regex = /^[A-Za-z0-9_-]{1,256}$/;

  static email_format_msg = "Enter a valid E-Mail address.";

  static name_format_msg = "Name should have at least 5 characters and may contain only [a-z, 0-9, -, _].";

  static username_format_msg = "Username should have at least 5 characters and may contain only [A-Z, a-z, space].";

  static password_format_msg = "Password must be at least 8 characters and must include at least one uppercase letter, one lowercase letter, one number, and one special character.";

  static repo_format_msg = "Repo Name should have at least 5 characters and may contain only [a-z, 0-9, -, _].";

  static folder_format_msg = "Folder Name should have at least 5 characters and may contain only [a-z, 0-9, -, _].";

  static file_format_msg = "File Name should have at least 5 characters and may contain only [a-z, 0-9, -, _].";

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