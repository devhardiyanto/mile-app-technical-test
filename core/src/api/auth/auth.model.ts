import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type Auth = z.infer<typeof AuthSchema>;
export const AuthSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input Validation for 'GET auths/:id' endpoint
export const GetAuthSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

// Login schemas
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address').openapi({ example: 'user@example.com' }),
  password: z.string().min(6, 'Password must be at least 6 characters').openapi({ example: 'password123' }),
});

export const LoginResponseSchema = z.object({
  token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
  user: z.object({
    id: z.string().openapi({ example: 'user_123' }),
    email: z.string().email().openapi({ example: 'user@example.com' }),
    name: z.string().openapi({ example: 'John Doe' }),
  }),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
