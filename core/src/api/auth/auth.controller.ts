import type { Request, RequestHandler, Response } from "express";

import { authService } from "@/api/auth/auth.service";
import { LoginSchema } from "@/api/auth/auth.model";

class AuthController {
  public getAuths: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await authService.findAll();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getAuth: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await authService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public login: RequestHandler = async (req: Request, res: Response) => {
    try {
      const credentials = LoginSchema.parse(req.body);
      const serviceResponse = await authService.login(credentials);
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
}

export const authController = new AuthController();
