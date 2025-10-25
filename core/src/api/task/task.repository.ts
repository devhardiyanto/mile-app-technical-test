import { TaskModel, type ITask } from '@/database/mongodb/models';
import type { CreateTaskInput, GetTasksQuery, UpdateTaskInput } from './task.model';

export interface PaginatedTasksResult {
  data: ITask[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class TaskRepository {
  async findAllAsync(userId: string, query: GetTasksQuery): Promise<PaginatedTasksResult> {
    const { page, limit, status, priority, sortBy, sortOrder, search } = query;

    // Build filter
    const filter: any = { userId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      TaskModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      TaskModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByIdAsync(id: string, userId: string): Promise<ITask | null> {
    return await TaskModel.findOne({ _id: id, userId }).exec();
  }

  async createAsync(userId: string, data: CreateTaskInput): Promise<ITask> {
    const task = new TaskModel({ ...data, userId });
    return await task.save();
  }

  async updateAsync(id: string, userId: string, data: UpdateTaskInput): Promise<ITask | null> {
    return await TaskModel.findOneAndUpdate({ _id: id, userId }, data, { new: true }).exec();
  }

  async deleteAsync(id: string, userId: string): Promise<boolean> {
    const result = await TaskModel.findOneAndDelete({ _id: id, userId }).exec();
    return result !== null;
  }
}
