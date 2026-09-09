import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'
const dbUrl = process.env.DRIZZLE_DB_URL || process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;
if (!dbUrl) {
  throw new Error("DRIZZLE_DB_URL is not set in environment variables");
}
const sql = neon(dbUrl);
export const db = drizzle({ client: sql }, { schema });
