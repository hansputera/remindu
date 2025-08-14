import { pgTable, varchar, text, bigint, timestamp } from "drizzle-orm/pg-core"
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: bigint("id", { mode: 'bigint' }).primaryKey().generatedAlwaysAsIdentity(),
  fullName: varchar("full_name", { length: 255 }),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()) // Drizzle's runtime update hook
    .notNull(),
});