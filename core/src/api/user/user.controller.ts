import type { Request, RequestHandler, Response } from 'express';
import { userService } from './user.service';

class UserController {
  // MySQL Controllers
  public getAllUsersMySQL: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAllMySQL();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getUserMySQL: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.findByIdMySQL(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createUserMySQL: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await userService.createMySQL(req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateUserMySQL: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.updateMySQL(id, req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteUserMySQL: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.deleteMySQL(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // MongoDB Controllers
  public getAllUsersMongoDB: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAllMongoDB();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getUserMongoDB: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const serviceResponse = await userService.findByIdMongoDB(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createUserMongoDB: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await userService.createMongoDB(req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateUserMongoDB: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const serviceResponse = await userService.updateMongoDB(id, req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteUserMongoDB: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const serviceResponse = await userService.deleteMongoDB(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const userController = new UserController();
