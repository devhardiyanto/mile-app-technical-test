import type { Auth } from "@/api/auth/auth.model";

export const auths: Auth[] = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    age: 42,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
  },
  {
    id: 2,
    name: "Robert",
    email: "Robert@example.com",
    age: 21,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
  },
];

export class AuthRepository {
  async findAllAsync(): Promise<Auth[]> {
    return auths;
  }

  async findByIdAsync(id: number): Promise<Auth | null> {
    return auths.find((auth) => auth.id === id) || null;
  }
}
