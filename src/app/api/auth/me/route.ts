import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from 'root/db'; // your Drizzle instance
import { users } from 'root/db/schema';
import { eq } from 'drizzle-orm';

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  try {
    // Step 1: Extract JWT from request
    const token = await getToken({ req, secret });
    if (!token || !token.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Step 2: Fetch user from PostgreSQL
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        // do NOT select password
      })
      .from(users)
      .where(eq(users.id, parseInt(token.id))); // token.id is string, id is number

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Step 3: Return user profile
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
