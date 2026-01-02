import { randomBytes, scryptSync } from "crypto";

export class HelperService {
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