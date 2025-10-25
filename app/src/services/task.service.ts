import client from '@/lib/client';
import type { Task, CreateTaskInput, UpdateTaskInput, GetTasksQuery } from '@/types/task';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

export const TaskService = {
  async getTasks(query?: GetTasksQuery): Promise<PaginatedResponse<Task>> {
    const { data } = await client.get<ApiResponse<PaginatedResponse<Task>>>('/tasks', { params: query });
    return data.responseObject;
  },

  async getTaskById(id: string): Promise<Task> {
    const { data } = await client.get<ApiResponse<Task>>(`/tasks/${id}`);
    return data.responseObject;
  },

  async createTask(input: CreateTaskInput): Promise<Task> {
    const { data } = await client.post<ApiResponse<Task>>('/tasks', input);
    return data.responseObject;
  },

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const { data } = await client.put<ApiResponse<Task>>(`/tasks/${id}`, input);
    return data.responseObject;
  },

  async deleteTask(id: string): Promise<void> {
    await client.delete(`/tasks/${id}`);
  },
};