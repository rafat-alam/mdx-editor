import CredentialsProvider from "next-auth/providers/credentials";
import { getDB } from "root/db";
import { user } from "root/db/schema";
import { eq, or } from "drizzle-orm";
import { AuthOptions } from "next-auth";
import { HelperService } from "@/module/services/helper_service";
import type { User } from "next-auth";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? 'rafat',
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email_username: { label: "Email-Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) return null;

        const db = await getDB();
        const identifier = credentials.email_username.trim().toLowerCase();

        const [db_user] = await db.select().from(user).where(or(eq(user.email, identifier), eq(user.username, identifier)));

        if (!db_user) throw new Error("Invalid credentials");

        const is_valid = HelperService.verify(credentials.password, db_user.password_hash);

        if (!is_valid) throw new Error("Invalid credentials");

        return {
          id: db_user.user_id,
          user_id: db_user.user_id,
          username: db_user.username,
          name: db_user.name,
          email: db_user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user_id = user.user_id;
        token.username = user.username;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.user_id = token.user_id as string;
        session.user.username = token.username as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};