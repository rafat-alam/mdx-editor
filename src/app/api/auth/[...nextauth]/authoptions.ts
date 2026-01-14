import CredentialsProvider from "next-auth/providers/credentials";
import { getDB } from "root/db";
import { user } from "root/db/schema";
import { eq, or } from "drizzle-orm";
import { AuthOptions } from "next-auth";
import { HelperService } from "@/module/services/helper_service";
import type { User } from "next-auth";
import { v4 } from "uuid";
import { UserService } from "@/module/services/user_service";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? 'rafat',
  session: {
    strategy: "jwt",
    maxAge: 604800,
  },
  jwt: {
    maxAge: 604800,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "identifier", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) return null;

        const db = await getDB();
        const identifier = credentials.identifier.trim().toLowerCase();

        let db_user;
        try {
          const res = await db.select().from(user).where(or(eq(user.email, identifier), eq(user.username, identifier)));
          db_user = res[0]
        } catch {
          throw new Error("INTERNAL SERVER ERROR!");
        }

        if (!db_user) throw new Error("Invalid credentials!");

        const is_valid = HelperService.verify(credentials.password, db_user.password_hash);

        if (!is_valid) throw new Error("Invalid credentials!");

        const session_id = v4();

        try {
          await fetch(
            `${process.env.UPSTASH_REDIS_REST_URL}/set/session:${db_user.user_id}/${session_id}?ex=604800`, {
            headers: {
              Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
            },
          });

          await fetch(
            `${process.env.UPSTASH_REDIS_REST_URL}/set/last-active:${db_user.user_id}/${Date.now()}`, {
            headers: {
              Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
            },
          });
        } catch {
          throw new Error("INTERNAL SERVER ERROR!");
        }

        return {
          id: db_user.user_id,
          user_id: db_user.user_id,
          username: db_user.username,
          name: db_user.name,
          email: db_user.email,
          session_id: session_id,
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
        token.session_id = user.session_id;
        return token;
      }

      const res = await UserService.get_user_by_id(token.user_id);

      if (res.status != 200) return token;

      const db_user = res.user!;

      token.user_id = token.user_id;
      token.username = db_user.username;
      token.name = db_user.name;
      token.email = db_user.email;
      token.session_id = token.session_id;

      return token;
    },

    async session({ session, token }) {
      session.user = {
        user_id: token.user_id,
        username: token.username,
        name: token.name,
        email: token.email,
        session_id: token.session_id,
      };
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      console.log(token);
      if (!token?.user_id || !token?.session_id) return;

      try {
        await fetch(
          `${process.env.UPSTASH_REDIS_REST_URL}/del/session:${token.user_id}/${token.session_id}`, {
            headers: {
              Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
            },
          }
        );
      } catch {
        throw new Error("INTERNAL SERVER ERROR!");
      }
    },
  },
  pages: {
    signIn: "/signin",
  },
};