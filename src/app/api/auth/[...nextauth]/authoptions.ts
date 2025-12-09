import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "root/db";
import { users } from "root/db/schema";
import { ilike } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email_username: { label: "Email-Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Fetch user from Postgres
        const [user1] = await db
          .select()
          .from(users)
          .where(ilike(users.email, credentials.email_username.trim().toLowerCase()));

        const [user2] = await db
          .select()
          .from(users)
          .where(ilike(users.username, credentials.email_username.trim().toLowerCase()));

        if (!user1 && !user2) throw new Error("Invalid credentials");

        if(user1) {
          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user1.password);
          if (!isValid) throw new Error("Invalid credentials");

          // Return user info for JWT/session
          return {
            id: user1.id.toString(),
            email: user1.email,
            username: user1.username,
          };
        } else {
          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user2.password);
          if (!isValid) throw new Error("Invalid credentials");

          // Return user info for JWT/session
          return {
            id: user2.id.toString(),
            email: user2.email,
            username: user2.username,
          };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
