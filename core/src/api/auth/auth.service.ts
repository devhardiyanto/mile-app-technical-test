import { StatusCodes } from "http-status-codes";

import type { Auth, LoginInput, LoginResponse } from "@/api/auth/auth.model";
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

  // Mock login - returns a mock token
  async login(credentials: LoginInput): Promise<ServiceResponse<LoginResponse | null>> {
    try {
      // Mock validation - accept any email/password combination
      // In production, you would validate against database and use proper JWT
      const { email, password } = credentials;

      // Simple mock validation
      if (password.length < 6) {
        return ServiceResponse.failure("Invalid credentials", null, StatusCodes.UNAUTHORIZED);
      }

      // Generate mock token (in production, use proper JWT)
      const mockToken = `mock_token_${Buffer.from(email).toString('base64')}_${Date.now()}`;
      const mockUserId = `user_${Buffer.from(email).toString('base64').slice(0, 10)}`;

      const response: LoginResponse = {
        token: mockToken,
        user: {
          id: mockUserId,
          email,
          name: email.split('@')[0], // Use email prefix as name
        },
      };

      logger.info(`User logged in: ${email}`);
      return ServiceResponse.success<LoginResponse>("Login successful", response);
    } catch (ex) {
      const errorMessage = `Error during login: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred during login.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const authService = new AuthService();
