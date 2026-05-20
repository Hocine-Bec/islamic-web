import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/db/schema";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// Handle build-time scenarios where DB credentials might be missing
const client = createClient({
  url: url || "file:./local.db",
  authToken: authToken,
});

export const db = drizzle(client, { schema });