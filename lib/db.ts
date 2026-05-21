import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/db/schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Cache the client across hot reloads in development
// and across invocations in production
const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof createClient> | undefined;
};

const client =
  globalForDb.client ??
  createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

globalForDb.client = client;

export const db = drizzle(client, { schema });