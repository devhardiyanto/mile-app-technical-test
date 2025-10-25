import { StatusCodes } from "http-status-codes";

import type { Auth } from "@/api/auth/auth.model";
import { AuthRepository } from "@/api/auth/auth.repository";
import { ServiceResponse } from "@/common/models/service.response";
import { logger } from "@/server";

export class AuthService {
  private authRepository: AuthRepository;

  constructor(repository: AuthRepository = new AuthRepository()) {
    this.authRepository = repository;
  }

  // Retrieves all auths from the database
  async findAll(): Promise<ServiceResponse<Auth[] | null>> {
    try {
      const auths = await this.authRepository.findAllAsync();
      if (!auths || auths.length === 0) {
        return ServiceResponse.failure("No Auths found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Auth[]>("Auths found", auths);
    } catch (ex) {
      const errorMessage = `Error finding all auths: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving auths.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieves a single auth by their ID
  async findById(id: number): Promise<ServiceResponse<Auth | null>> {
    try {
      const auth = await this.authRepository.findByIdAsync(id);
      if (!auth) {
        return ServiceResponse.failure("Auth not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Auth>("Auth found", auth);
    } catch (ex) {
      const errorMessage = `Error finding auth with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding auth.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const authService = new AuthService();
