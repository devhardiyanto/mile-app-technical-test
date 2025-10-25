import { eq } from 'drizzle-orm';
import { mysqlDb } from '@/database/mysql/connection';
import { users, type User, type NewUser } from '@/database/mysql/schema';

export class UserMySQLRepository {
  async findAllAsync(): Promise<User[]> {
    return await mysqlDb.select().from(users);
  }

  async findByIdAsync(id: number): Promise<User | null> {
    const result = await mysqlDb.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  }

  async findByEmailAsync(email: string): Promise<User | null> {
    const result = await mysqlDb.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || null;
  }

  async createAsync(data: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const result = await mysqlDb.insert(users).values(data);
    const insertId = Number(result[0].insertId);
    const newUser = await this.findByIdAsync(insertId);
    if (!newUser) {
      throw new Error('Failed to create user');
    }
    return newUser;
  }

  async updateAsync(
    id: number,
    data: Partial<Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<User | null> {
    await mysqlDb.update(users).set(data).where(eq(users.id, id));
    return await this.findByIdAsync(id);
  }

  async deleteAsync(id: number): Promise<boolean> {
    const result = await mysqlDb.delete(users).where(eq(users.id, id));
    return result[0].affectedRows > 0;
  }
}
