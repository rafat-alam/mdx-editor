import { eq } from "drizzle-orm";
import { user } from "root/db/schema";
import { User } from "../entities/user";
import { getDB } from "root/db";

export class UserRepo {
  private static async get_database() {
    return await getDB();
  }

  private static async check_exists(condition: any): Promise<boolean> {
    const db = await this.get_database();
    const result = await db.select().from(user).where(condition);
    return result.length > 0;
  }

  private static async find_users(condition: any): Promise<User[]> {
    const db = await this.get_database();
    return await db.select().from(user).where(condition);
  }

  static async find_by_username(username: string): Promise<boolean> {
    return this.check_exists(eq(user.username, username));
  }

  static async find_by_user_id(user_id: string): Promise<boolean> {
    return this.check_exists(eq(user.user_id, user_id));
  }

  static async find_by_email(email: string): Promise<boolean> {
    return this.check_exists(eq(user.email, email));
  }

  static async create(user_data: User): Promise<void> {
    const db = await this.get_database();
    await db.insert(user).values({
      user_id: user_data.user_id,
      username: user_data.username,
      name: user_data.name,
      email: user_data.email,
      password_hash: user_data.password_hash
    });
  }

  static async update_password(email: string, password_hash: string): Promise<void> {
    const db = await this.get_database();
    await db.update(user)
      .set({ password_hash })
      .where(eq(user.email, email));
  }

  static async update_email(user_id: string, new_email: string): Promise<void> {
    const db = await this.get_database();
    await db.update(user)
      .set({ email: new_email })
      .where(eq(user.user_id, user_id));
  }

  static async get_user(username: string): Promise<User[]> {
    return this.find_users(eq(user.username, username));
  }

  static async get_user_by_id(user_id: string): Promise<User[]> {
    return this.find_users(eq(user.user_id, user_id));
  }

  static async get_all_users(): Promise<User[]> {
    const db = await this.get_database();
    return await db.select().from(user);
  }
}
