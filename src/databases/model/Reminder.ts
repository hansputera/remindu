import { db } from "../db";
import { reminders, mylists } from "../schema";
import { eq, and } from "drizzle-orm";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type Reminder = InferSelectModel<typeof reminders>;
export type NewReminder = InferInsertModel<typeof reminders>;

export class ReminderModel {

  static async create(data: NewReminder): Promise<Reminder> {
    // check ownership
    const [list] = await db
      .select()
      .from(mylists)
      .where(and(eq(mylists.id, data.listId), eq(mylists.userId, data.userId)));

    if (!list) {
      throw new Error("List not found or does not belong to user");
    }

    const [inserted] = await db
      .insert(reminders)
      .values(data)
      .returning();

    return inserted;
  }

  static async deleteById(reminderId: number, userId: number): Promise<number> {
    const result = await db
      .delete(reminders)
      .where(
        and(
          eq(reminders.id, reminderId),
          eq(reminders.userId, userId),
        )
      );

    return result.rowCount ?? 0;
  }

  static async updateById(
    reminderId: number,
    userId: number,
    updates: Partial<Pick<Reminder, "waitingType" | "onEpisode" | "onDate">>
  ): Promise<number> {
    const result = await db
      .update(reminders)
      .set(updates)
      .where(
        and(
          eq(reminders.id, reminderId),
          eq(reminders.userId, userId), 
        )
      );

    return result.rowCount ?? 0;
  }

  static async getById(reminderId: number): Promise<Reminder | undefined> {
    const [reminder] = await db
      .select()
      .from(reminders)
      .where(eq(reminders.id, reminderId));

    return reminder;
  }

  static async getByListId(listId: number): Promise<Reminder[]> {
    return db
      .select()
      .from(reminders)
      .where(eq(reminders.listId, listId));
  }
  
  static async getAll(): Promise<Reminder[]> {
    return db.select().from(reminders);
  }
}