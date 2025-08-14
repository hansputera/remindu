import { pgTable, text, bigint, timestamp, integer } from "drizzle-orm/pg-core"
import { sql } from 'drizzle-orm';
import { users } from './user';

export const mylist = pgTable('mylist', {
  id: bigint("id", { mode: 'bigint' }).primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  image: text(),
  episode: integer().notNull().default(1),
  userId: bigint("user_id", { mode: 'bigint' }).references(() => users.id).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()) // Drizzle's runtime update hook
    .notNull(),
});
