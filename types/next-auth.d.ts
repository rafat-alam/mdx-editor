import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      user_id: string;
      session_id: string;
    };
  }

  interface User {
    user_id: string;
    session_id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user_id: string;
    session_id: string;
  }
}