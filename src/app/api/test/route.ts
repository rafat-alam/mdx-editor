import { NextResponse } from 'next/server';
import { db } from 'root/db';           // your drizzle instance
import { users } from 'root/db/schema'; // your users table schema

export async function GET() {
  try {
    // Simple select all users
    const allUsers = await db.select().from(users);

    // Send them back as JSON
    return NextResponse.json({ success: true, users: allUsers });
  } catch (err) {
    console.error('DB test route error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
