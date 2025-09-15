/**
 * NextAuth route handler for authentication API.
 *
 * - This file exposes the NextAuth API under `/api/auth/*`
 * - Handles both GET (session fetch) and POST (sign-in/out) requests
 * - Uses `authOptions` from `lib/auth.ts` for configuration
 *
 * Next.js App Router requires exporting both GET and POST handlers explicitly.
 */

import NextAuth from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authoptions";

// Create a NextAuth handler instance with our configuration
const handler = NextAuth(authOptions);

// Expose the handler for GET and POST requests
export { handler as GET, handler as POST };
