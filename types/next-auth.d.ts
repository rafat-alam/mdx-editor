import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      user_id: string;
      username: string;
      name: string;
      email: string;
    };
  }

  interface User {
    user_id: string;
    username: string;
    name: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user_id: string;
    username: string;
    name: string;
    email: string;
  }
}