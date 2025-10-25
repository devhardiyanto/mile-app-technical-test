import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';
import {
  TaskSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  GetTasksQuerySchema,
} from './task.model';
import { createApiResponse } from '@/api-docs/openapi.response-builder';
import { taskController } from './task.controller';

export const taskRegistry = new OpenAPIRegistry();
export const taskRouter: Router = express.Router();

taskRegistry.register('Task', TaskSchema);

// GET /tasks - Get all tasks with pagination, filter, sort
taskRegistry.registerPath({
  method: 'get',
  path: '/tasks',
  tags: ['Tasks'],
  request: {
    query: GetTasksQuerySchema,
  },
  responses: createApiResponse(
    z.object({
      data: z.array(TaskSchema),
      meta: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
      }),
    }),
    'Success'
  ),
  description: 'Get all tasks with pagination, filtering, and sorting support',
});
taskRouter.get('/', taskController.getTasks);

// GET /tasks/:id - Get task by ID
taskRegistry.registerPath({
  method: 'get',
  path: '/tasks/{id}',
  tags: ['Tasks'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '507f1f77bcf86cd799439011' }),
    }),
  },
  responses: createApiResponse(TaskSchema, 'Success'),
  description: 'Get a single task by ID',
});
taskRouter.get('/:id', taskController.getTask);

// POST /tasks - Create new task
taskRegistry.registerPath({
  method: 'post',
  path: '/tasks',
  tags: ['Tasks'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateTaskSchema,
        },
      },
    },
  },
  responses: createApiResponse(TaskSchema, 'Success'),
  description: 'Create a new task',
});
taskRouter.post('/', taskController.createTask);

// PUT /tasks/:id - Update task
taskRegistry.registerPath({
  method: 'put',
  path: '/tasks/{id}',
  tags: ['Tasks'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '507f1f77bcf86cd799439011' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateTaskSchema,
        },
      },
    },
  },
  responses: createApiResponse(TaskSchema, 'Success'),
  description: 'Update an existing task',
});
taskRouter.put('/:id', taskController.updateTask);

// DELETE /tasks/:id - Delete task
taskRegistry.registerPath({
  method: 'delete',
  path: '/tasks/{id}',
  tags: ['Tasks'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '507f1f77bcf86cd799439011' }),
    }),
  },
  responses: createApiResponse(z.null(), 'Success'),
  description: 'Delete a task',
});
taskRouter.delete('/:id', taskController.deleteTask);
