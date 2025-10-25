import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from '@/common/models/service.response';
import { logger } from '@/server';
import { TaskRepository, type PaginatedTasksResult } from './task.repository';
import type { CreateTaskInput, GetTasksQuery, Task, UpdateTaskInput } from './task.model';

export class TaskService {
  private repository: TaskRepository;

  constructor(repository: TaskRepository = new TaskRepository()) {
    this.repository = repository;
  }

  async findAll(userId: string, query: GetTasksQuery): Promise<ServiceResponse<PaginatedTasksResult | null>> {
    try {
      const result = await this.repository.findAllAsync(userId, query);
      return ServiceResponse.success<PaginatedTasksResult>('Tasks retrieved successfully', result);
    } catch (ex) {
      const errorMessage = `Error finding tasks: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while retrieving tasks.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findById(id: string, userId: string): Promise<ServiceResponse<Task | null>> {
    try {
      const task = await this.repository.findByIdAsync(id, userId);
      if (!task) {
        return ServiceResponse.failure('Task not found', null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Task>('Task found', task as Task);
    } catch (ex) {
      const errorMessage = `Error finding task with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding task.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(userId: string, data: CreateTaskInput): Promise<ServiceResponse<Task | null>> {
    try {
      const task = await this.repository.createAsync(userId, data);
      return ServiceResponse.success<Task>('Task created successfully', task as Task, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating task: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while creating task.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, userId: string, data: UpdateTaskInput): Promise<ServiceResponse<Task | null>> {
    try {
      const task = await this.repository.updateAsync(id, userId, data);
      if (!task) {
        return ServiceResponse.failure('Task not found', null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Task>('Task updated successfully', task as Task);
    } catch (ex) {
      const errorMessage = `Error updating task with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while updating task.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: string, userId: string): Promise<ServiceResponse<null>> {
    try {
      const deleted = await this.repository.deleteAsync(id, userId);
      if (!deleted) {
        return ServiceResponse.failure('Task not found', null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success('Task deleted successfully', null);
    } catch (ex) {
      const errorMessage = `Error deleting task with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while deleting task.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const taskService = new TaskService();
