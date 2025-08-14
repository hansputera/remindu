import { pgTable, varchar, bigint, timestamp, integer, date } from "drizzle-orm/pg-core"
import { sql } from 'drizzle-orm';
import { mylists } from './mylists';
import { users } from './users';

export const reminders = pgTable('reminders', {
  id: bigint("id", { mode: 'bigint' }).primaryKey().generatedAlwaysAsIdentity(),
  listId: bigint("list_id", { mode: 'bigint' }).references(() => mylists.id).notNull(),
  userId: bigint("user_id", { mode: 'bigint' }).references(() => users.id).notNull(),
  waitingType: varchar("waiting_type", { length: 20, enum: ['episode', 'date'] }).notNull().default('episode'),
  onEpisode: integer(),
  onDate: date('on_date', { mode: 'date' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()) // Drizzle's runtime update hook
    .notNull(),
});