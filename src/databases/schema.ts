import { pgTable, varchar, text, timestamp, integer, date } from "drizzle-orm/pg-core"
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  fullName: varchar("full_name", { length: 255 }),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(), // for WA notification
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()) // Drizzle's runtime update hook
    .notNull(),
});

export const mylists = pgTable('mylists', {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  image: text(),
  episode: integer().notNull().default(1),
  userId: integer("user_id").references(() => users.id).notNull(),
  status: varchar("status", { length: 20, enum: ['active', 'inactive'] }).notNull().default('active'),
  
  waitingType: varchar("waiting_type", { length: 20, enum: ['disabled', 'episode', 'date'] }).notNull().default('disabled'),
  onEpisode: integer(),
  onDate: date('on_date', { mode: 'date' }),
  
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()) // Drizzle's runtime update hook
    .notNull(),
});

// export const reminders = pgTable('reminders', {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   listId: integer("list_id").references(() => mylists.id).notNull(),
//   userId: integer("user_id").references(() => users.id).notNull(),
//   waitingType: varchar("waiting_type", { length: 20, enum: ['episode', 'date'] }).notNull().default('episode'),
//   onEpisode: integer(),
//   onDate: date('on_date', { mode: 'date' }),
//   createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
//   updatedAt: timestamp('updatedAt', { mode: 'date' })
//     .default(sql`CURRENT_TIMESTAMP`)
//     .$onUpdate(() => new Date()) // Drizzle's runtime update hook
//     .notNull(),
// });