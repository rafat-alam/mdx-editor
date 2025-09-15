import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql', // not "pg"
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});