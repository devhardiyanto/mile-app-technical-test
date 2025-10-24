import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { GetAuthSchema, AuthSchema } from "@/api/auth/auth.model";
import { createApiResponse } from "@/api-docs/openapi.response-builder";
import { validateRequest } from "@/common/utils/http.handler";
import { authController } from "./auth.controller";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.register("Auth", AuthSchema);

authRegistry.registerPath({
  method: "get",
  path: "/auths",
  tags: ["Auth"],
  responses: createApiResponse(z.array(AuthSchema), "Success"),
});

authRouter.get("/", authController.getAuths);

authRegistry.registerPath({
  method: "get",
  path: "/auths/{id}",
  tags: ["Auth"],
  request: { params: GetAuthSchema.shape.params },
  responses: createApiResponse(AuthSchema, "Success"),
});

authRouter.get("/:id", validateRequest(GetAuthSchema), authController.getAuth);
