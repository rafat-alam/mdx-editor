import { eq } from "drizzle-orm";
import { user } from "root/db/schema";
import { User } from "../entities/user";
import { getDB } from "root/db";

export class UserRepo {
  static async find_by_username(username: string): Promise<any> {
    const db = await getDB();
    const res = await db.select().from(user).where(eq(user.username, username));
    return res.length > 0;
  }

  static async find_by_email(email: string): Promise<any> {
    const db = await getDB();
    const res = await db.select().from(user).where(eq(user.email, email));
    return res.length > 0;
  }

  static async create(user_data: User): Promise<any> {
    const db = await getDB();
    
    await db.insert(user).values({ 
      user_id: user_data.user_id,
      username: user_data.username,
      name: user_data.name,
      email: user_data.email,
      password_hash: user_data.password_hash,
      last_active: new Date()
    });
  }

  static async update_password(email: string, password_hash: string): Promise<any> {
    const db = await getDB();
    await db.update(user).set({ password_hash: password_hash }).where(eq(user.email, email));
  }

  static async update_mail(email: string, new_email: string): Promise<any> {
    const db = await getDB();
    await db.update(user).set({ email: new_email }).where(eq(user.email, email));
  }

  static async get_user(username: string): Promise<User []> {
    const db = await getDB();
    const res = await db.select().from(user).where(eq(user.username, username));
    return res;
  }

  static async set_time(username: string): Promise<any> {
    const db = await getDB();
    await db.update(user).set({ last_active: new Date() }).where(eq(user.username, username));
  }
}
