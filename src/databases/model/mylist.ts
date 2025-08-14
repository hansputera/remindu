import { db } from "../db"; // Your Drizzle DB instance
import { mylists } from "../schema/mylists";
import { and, eq } from "drizzle-orm";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type MyList = InferSelectModel<typeof mylists>;
export type NewMyList = InferInsertModel<typeof mylists>;

export class MyListModel {

  static async create(data: NewMyList): Promise<MyList> {
    const [inserted] = await db
      .insert(mylists)
      .values(data)
      .returning();
    return inserted;
  }

  static async deleteById(listId: bigint, userId: bigint): Promise<number> {
    const result = await db
      .delete(mylists)
      .where(and(eq(mylists.id, listId), eq(mylists.userId, userId)));
    return result.rowCount ?? 0;
  }

  static async updateById(
    listId: bigint,
    userId: bigint,
    updates: Partial<Pick<MyList, "title" | "image" | "episode">>
  ): Promise<number> {
    const result = await db
      .update(mylists)
      .set(updates)
      .where(and(eq(mylists.id, listId), eq(mylists.userId, userId)));
    return result.rowCount ?? 0;
  }

  static async getById(listId: bigint, userId: bigint): Promise<MyList | undefined> {
    const [list] = await db
      .select()
      .from(mylists)
      .where(and(eq(mylists.id, listId), eq(mylists.userId, userId)));
    return list;
  }

  static async getByUserId(userId: bigint): Promise<MyList[]> {
    return db
      .select()
      .from(mylists)
      .where(eq(mylists.userId, userId));
  }
}