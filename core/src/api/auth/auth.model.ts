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
