import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// User Schema
export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  password: z.string().min(6).max(255),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create User Schema
export const CreateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255),
    email: z.string().email().max(255),
    password: z.string().min(6).max(255),
  }),
});

// Update User Schema
export const UpdateUserSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    email: z.string().email().max(255).optional(),
    password: z.string().min(6).max(255).optional(),
  }),
});

// Get User Schema
export const GetUserSchema = z.object({
  params: z.object({ id: z.string() }),
});

// Delete User Schema
export const DeleteUserSchema = z.object({
  params: z.object({ id: z.string() }),
});
