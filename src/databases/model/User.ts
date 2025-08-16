import { db } from "../db"; // Your Drizzle DB instance
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";
import { users } from '../schema';

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export class UserModel {

  static async create(user: NewUser): Promise<User> {
    const [inserted] = await db.insert(users).values(user).returning();
    return inserted;
  }

  static async deleteById(id: number): Promise<number> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount ?? 0;
  }

  static async updatePassword(id: number, newPassword: string): Promise<number> {
    const result = await db.update(users).set({ password: newPassword }).where(eq(users.id, id));
    return result.rowCount ?? 0;
  }
  
  static async updateEmail(id: number, email: string): Promise<number> {
    const result = await db.update(users).set({ email }).where(eq(users.id, id));
    return result.rowCount ?? 0;
  }
  
  static async updateNameAndPhone(id: number, name: string, phone: string): Promise<number> {
    const result = await db.update(users).set({ fullName: name, phone }).where(eq(users.id, id));
    return result.rowCount ?? 0;
  }

  static async getById(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  static async getByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }
}
