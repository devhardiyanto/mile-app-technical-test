import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';
import {
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  GetUserSchema,
  DeleteUserSchema,
} from './user.model';
import { createApiResponse } from '@/api-docs/openapi.response-builder';
import { validateRequest } from '@/common/utils/http.handler';
import { userController } from './user.controller';

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register('User', UserSchema);

// MySQL Routes
userRegistry.registerPath({
  method: 'get',
  path: '/users/mysql',
  tags: ['Users - MySQL'],
  responses: createApiResponse(z.array(UserSchema), 'Success'),
});
userRouter.get('/mysql', userController.getAllUsersMySQL);

userRegistry.registerPath({
  method: 'get',
  path: '/users/mysql/{id}',
  tags: ['Users - MySQL'],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, 'Success'),
});
userRouter.get('/mysql/:id', validateRequest(GetUserSchema), userController.getUserMySQL);

userRegistry.registerPath({
  method: 'post',
  path: '/users/mysql',
  tags: ['Users - MySQL'],
  request: { body: { content: { 'application/json': { schema: CreateUserSchema.shape.body } } } },
  responses: createApiResponse(UserSchema, 'Success'),
});
userRouter.post('/mysql', validateRequest(CreateUserSchema), userController.createUserMySQL);

userRegistry.registerPath({
  method: 'put',
  path: '/users/mysql/{id}',
  tags: ['Users - MySQL'],
  request: {
    params: UpdateUserSchema.shape.params,
    body: { content: { 'application/json': { schema: UpdateUserSchema.shape.body } } },
  },
  responses: createApiResponse(UserSchema, 'Success'),
});
userRouter.put('/mysql/:id', validateRequest(UpdateUserSchema), userController.updateUserMySQL);

userRegistry.registerPath({
  method: 'delete',
  path: '/users/mysql/{id}',
  tags: ['Users - MySQL'],
  request: { params: DeleteUserSchema.shape.params },
  responses: createApiResponse(z.boolean(), 'Success'),
});
userRouter.delete('/mysql/:id', validateRequest(DeleteUserSchema), userController.deleteUserMySQL);

// MongoDB Routes
userRegistry.registerPath({
  method: 'get',
  path: '/users/mongodb',
  tags: ['Users - MongoDB'],
  responses: createApiResponse(z.array(UserSchema), 'Success'),
});
userRouter.get('/mongodb', userController.getAllUsersMongoDB);

userRegistry.registerPath({
  method: 'get',
  path: '/users/mongodb/{id}',
  tags: ['Users - MongoDB'],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, 'Success'),
});
userRouter.get('/mongodb/:id', validateRequest(GetUserSchema), userController.getUserMongoDB);

userRegistry.registerPath({
  method: 'post',
  path: '/users/mongodb',
  tags: ['Users - MongoDB'],
  request: { body: { content: { 'application/json': { schema: CreateUserSchema.shape.body } } } },
  responses: createApiResponse(UserSchema, 'Success'),
});
userRouter.post('/mongodb', validateRequest(CreateUserSchema), userController.createUserMongoDB);

userRegistry.registerPath({
  method: 'put',
  path: '/users/mongodb/{id}',
  tags: ['Users - MongoDB'],
  request: {
    params: UpdateUserSchema.shape.params,
    body: { content: { 'application/json': { schema: UpdateUserSchema.shape.body } } },
  },
  responses: createApiResponse(UserSchema, 'Success'),
});
userRouter.put('/mongodb/:id', validateRequest(UpdateUserSchema), userController.updateUserMongoDB);

userRegistry.registerPath({
  method: 'delete',
  path: '/users/mongodb/{id}',
  tags: ['Users - MongoDB'],
  request: { params: DeleteUserSchema.shape.params },
  responses: createApiResponse(z.boolean(), 'Success'),
});
userRouter.delete(
  '/mongodb/:id',
  validateRequest(DeleteUserSchema),
  userController.deleteUserMongoDB
);
