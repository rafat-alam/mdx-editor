import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

/**
 * HelperService provides utility functions for common operations
 * such as password hashing, verification, and time formatting
 */
export class HelperService {
  // Constants for password hashing
  private static readonly SALT_LENGTH = 16;
  private static readonly HASH_LENGTH = 64;
  private static readonly SCRYPT_COST = 64;

  /**
   * Hashes a password using scrypt algorithm with a random salt
   * @param password - Plain text password to hash
   * @returns Hashed password in format "salt:hash"
   */
  static hash(password: string): string {
    if (!password || password.length === 0) {
      throw new Error('Password cannot be empty');
    }

    const salt = randomBytes(this.SALT_LENGTH).toString("hex");
    const hash = scryptSync(password, salt, this.HASH_LENGTH).toString("hex");
    
    return `${salt}:${hash}`;
  }

  /**
   * Verifies a password against a stored hash using timing-safe comparison
   * @param password - Plain text password to verify
   * @param stored_hash - Stored hash in format "salt:hash"
   * @returns True if password matches, false otherwise
   */
  static verify(password: string, stored_hash: string): boolean {
    if (!password || !stored_hash) {
      return false;
    }

    const parts = stored_hash.split(":");
    if (parts.length !== 2) {
      return false;
    }

    const [salt, original_hash] = parts;
    
    try {
      const verification_hash = scryptSync(password, salt, this.HASH_LENGTH).toString("hex");
      
      // Use timing-safe comparison to prevent timing attacks
      const original_buffer = Buffer.from(original_hash, 'hex');
      const verification_buffer = Buffer.from(verification_hash, 'hex');
      
      if (original_buffer.length !== verification_buffer.length) {
        return false;
      }
      
      return timingSafeEqual(original_buffer, verification_buffer);
    } catch {
      return false;
    }
  }

  /**
   * Formats milliseconds into MM:SS format
   * @param milliseconds - Time in milliseconds
   * @returns Formatted time string in MM:SS format
   */
  static format_time(milliseconds: number): string {
    if (milliseconds < 0) {
      return "0:00";
    }

    const total_seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(total_seconds / 60);
    const seconds = total_seconds % 60;
    
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  /**
   * Formats milliseconds into a human-readable duration
   * @param milliseconds - Time in milliseconds
   * @returns Formatted duration (e.g., "2h 30m", "45m 20s", "30s")
   */
  static format_duration(milliseconds: number): string {
    if (milliseconds < 0) {
      return "0s";
    }

    const total_seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(total_seconds / 3600);
    const minutes = Math.floor((total_seconds % 3600) / 60);
    const seconds = total_seconds % 60;

    const parts: string[] = [];
    
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds}s`);
    }

    return parts.join(' ');
  }

  /**
   * Sanitizes user input to prevent XSS attacks
   * @param input - User input string
   * @returns Sanitized string
   */
  static sanitize_input(input: string): string {
    if (!input) {
      return '';
    }

    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000); // Limit length
  }

  /**
   * Validates if a string is a valid UUID v4
   * @param uuid - String to validate
   * @returns True if valid UUID v4, false otherwise
   */
  static is_valid_uuid(uuid: string): boolean {
    const uuid_pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuid_pattern.test(uuid);
  }

  /**
   * Validates if a string is a valid email address
   * @param email - Email string to validate
   * @returns True if valid email, false otherwise
   */
  static is_valid_email(email: string): boolean {
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email_pattern.test(email);
  }

  /**
   * Generates a random alphanumeric string
   * @param length - Length of the string to generate
   * @returns Random alphanumeric string
   */
  static generate_random_string(length: number = 32): string {
    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .substring(0, length);
  }

  /**
   * Generates a cryptographically secure random token
   * @param length - Length of the token in bytes (default: 32)
   * @returns Base64-encoded token
   */
  static generate_secure_token(length: number = 32): string {
    return randomBytes(length).toString('base64url');
  }

  /**
   * Delays execution for specified milliseconds
   * @param milliseconds - Time to delay in milliseconds
   * @returns Promise that resolves after delay
   */
  static async delay(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Truncates a string to specified length with ellipsis
   * @param text - Text to truncate
   * @param max_length - Maximum length
   * @returns Truncated string
   */
  static truncate(text: string, max_length: number = 100): string {
    if (!text || text.length <= max_length) {
      return text;
    }
    return text.substring(0, max_length - 3) + '...';
  }

  /**
   * Converts a string to title case
   * @param text - Text to convert
   * @returns Title-cased string
   */
  static to_title_case(text: string): string {
    if (!text) {
      return '';
    }

    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Removes all whitespace from a string
   * @param text - Text to process
   * @returns String without whitespace
   */
  static remove_whitespace(text: string): string {
    return text.replace(/\s+/g, '');
  }

  /**
   * Checks if a value is empty (null, undefined, empty string, empty array, or empty object)
   * @param value - Value to check
   * @returns True if empty, false otherwise
   */
  static is_empty(value: any): boolean {
    if (value === null || value === undefined) {
      return true;
    }
    
    if (typeof value === 'string') {
      return value.trim().length === 0;
    }
    
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    
    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }
    
    return false;
  }

  /**
   * Safely parses JSON string
   * @param json_string - JSON string to parse
   * @param default_value - Default value if parsing fails
   * @returns Parsed object or default value
   */
  static safe_json_parse<T>(json_string: string, default_value: T): T {
    try {
      return JSON.parse(json_string) as T;
    } catch {
      return default_value;
    }
  }

  /**
   * Masks sensitive information (like credit card numbers, emails)
   * @param value - Value to mask
   * @param visible_chars - Number of characters to show at start and end
   * @returns Masked string
   */
  static mask_sensitive_data(value: string, visible_chars: number = 4): string {
    if (!value || value.length <= visible_chars * 2) {
      return '*'.repeat(value.length);
    }

    const start = value.substring(0, visible_chars);
    const end = value.substring(value.length - visible_chars);
    const masked_length = value.length - (visible_chars * 2);
    
    return `${start}${'*'.repeat(masked_length)}${end}`;
  }

  /**
   * Calculates the difference between two dates in days
   * @param date1 - First date
   * @param date2 - Second date
   * @returns Number of days difference
   */
  static days_between(date1: Date, date2: Date): number {
    const milliseconds_per_day = 1000 * 60 * 60 * 24;
    const difference_ms = Math.abs(date1.getTime() - date2.getTime());
    return Math.floor(difference_ms / milliseconds_per_day);
  }

  /**
   * Checks if a date is in the past
   * @param date - Date to check
   * @returns True if date is in the past
   */
  static is_past_date(date: Date): boolean {
    return date.getTime() < Date.now();
  }

  /**
   * Checks if a date is in the future
   * @param date - Date to check
   * @returns True if date is in the future
   */
  static is_future_date(date: Date): boolean {
    return date.getTime() > Date.now();
  }
}