import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const TaskPrioritySchema = z.enum(['low', 'medium', 'high']).openapi({
  description: 'Task priority level',
  example: 'medium',
});

export const TaskStatusSchema = z.enum(['pending', 'completed']).openapi({
  description: 'Task status',
  example: 'pending',
});

export const TaskSchema = z.object({
  _id: z.string().openapi({ example: '507f1f77bcf86cd799439011' }),
  title: z.string().min(1).max(200).openapi({ example: 'Take out the trash' }),
  description: z.string().max(1000).optional().openapi({
    example: "It's very important to take the trash otherwise it's ruined",
  }),
  priority: TaskPrioritySchema,
  status: TaskStatusSchema,
  userId: z.string().openapi({ example: '507f1f77bcf86cd799439012' }),
  createdAt: z.string().or(z.date()).openapi({ example: '2024-01-15T10:30:00Z' }),
  updatedAt: z.string().or(z.date()).openapi({ example: '2024-01-15T10:30:00Z' }),
});

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  priority: TaskPrioritySchema.optional().default('medium'),
  status: TaskStatusSchema.optional().default('pending'),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  priority: TaskPrioritySchema.optional(),
  status: TaskStatusSchema.optional(),
});

export const GetTasksQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'priority', 'status']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional(),
});

export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type GetTasksQuery = z.infer<typeof GetTasksQuerySchema>;
