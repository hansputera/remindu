import { pgTable, foreignKey, integer, text, timestamp, varchar, date, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const mylists = pgTable("mylists", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "mylists_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	title: text().notNull(),
	image: text(),
	episode: integer().default(1).notNull(),
	userId: integer("user_id").notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	status: varchar({ length: 20 }).default('active').notNull(),
	waitingType: varchar("waiting_type", { length: 20 }).default('disabled').notNull(),
	onEpisode: integer(),
	onDate: date("on_date"),
	reminder: varchar({ length: 5 }).default('off').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "mylists_user_id_users_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	fullName: varchar("full_name", { length: 255 }),
	email: text().notNull(),
	password: text().notNull(),
	phone: varchar({ length: 20 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);
