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


// Future Backend Updates
// 1. Implement Rate Limiter
// 2. Change Username
// 3. Change Password
// 4. Delete Account
// 5. Change Name

// Error Codes
// 400 - Bad Request -> Toast Error Popup
// 401 - Not Authorized / Invalid Token -> redirect to /signin
// 403 - Forbidden -> redirect to /
// 404 - Not Found -> redirect to 404
// 500 - Internal Server Error -> redirect to /