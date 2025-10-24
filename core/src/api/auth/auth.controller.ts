import type { Request, RequestHandler, Response } from "express";

import { authService } from "@/api/auth/auth.services";

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
}

export const authController = new AuthController();
