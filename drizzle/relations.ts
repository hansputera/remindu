import { relations } from "drizzle-orm/relations";
import { users, mylists } from "./schema";

export const mylistsRelations = relations(mylists, ({one}) => ({
	user: one(users, {
		fields: [mylists.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	mylists: many(mylists),
}));