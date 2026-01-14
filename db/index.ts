import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";


let _db: any;
export function getDB() {
  if (!_db) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

     _db = drizzle(pool, { schema });
  }
  return _db;
}