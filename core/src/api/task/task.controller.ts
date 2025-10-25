import type { Request, RequestHandler, Response } from 'express';
import { taskService } from './task.service';
import { CreateTaskSchema, GetTasksQuerySchema, UpdateTaskSchema } from './task.model';

// Mock user ID for now (will be replaced with actual auth middleware)
const MOCK_USER_ID = 'user_123';

class TaskController {
  public getTasks: RequestHandler = async (req: Request, res: Response) => {
    try {
      const query = GetTasksQuerySchema.parse(req.query);
      const userId = (req as any).userId || MOCK_USER_ID; // Will come from auth middleware
      const serviceResponse = await taskService.findAll(userId, query);
      res.status(serviceResponse.statusCode).send(serviceResponse);
    } catch (error: any) {
      res.status(400).send({
        success: false,
        message: 'Invalid query parameters',
        responseObject: null,
        statusCode: 400,
      });
    }
  };

  public getTask: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = (req as any).userId || MOCK_USER_ID;
    const serviceResponse = await taskService.findById(id, userId);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createTask: RequestHandler = async (req: Request, res: Response) => {
    try {
      const data = CreateTaskSchema.parse(req.body);
      const userId = (req as any).userId || MOCK_USER_ID;
      const serviceResponse = await taskService.create(userId, data);
      res.status(serviceResponse.statusCode).send(serviceResponse);
    } catch (error: any) {
      res.status(400).send({
        success: false,
        message: error.errors?.[0]?.message || 'Invalid request body',
        responseObject: null,
        statusCode: 400,
      });
    }
  };

  public updateTask: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const data = UpdateTaskSchema.parse(req.body);
      const userId = (req as any).userId || MOCK_USER_ID;
      const serviceResponse = await taskService.update(id, userId, data);
      res.status(serviceResponse.statusCode).send(serviceResponse);
    } catch (error: any) {
      res.status(400).send({
        success: false,
        message: error.errors?.[0]?.message || 'Invalid request body',
        responseObject: null,
        statusCode: 400,
      });
    }
  };

  public deleteTask: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const userId = (req as any).userId || MOCK_USER_ID;
    const serviceResponse = await taskService.delete(id, userId);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const taskController = new TaskController();
