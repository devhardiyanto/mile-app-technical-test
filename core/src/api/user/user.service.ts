import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from '@/common/models/service.response';
import { logger } from '@/server';
import { UserMySQLRepository } from './user.repository.mysql';
import { UserMongoDBRepository } from './user.repository.mongodb';

interface UserData {
  id?: number | string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserService {
  private mysqlRepository: UserMySQLRepository;
  private mongodbRepository: UserMongoDBRepository;

  constructor(
    mysqlRepo: UserMySQLRepository = new UserMySQLRepository(),
    mongodbRepo: UserMongoDBRepository = new UserMongoDBRepository()
  ) {
    this.mysqlRepository = mysqlRepo;
    this.mongodbRepository = mongodbRepo;
  }

  // MySQL Methods
  async findAllMySQL(): Promise<ServiceResponse<UserData[] | null>> {
    try {
      const users = await this.mysqlRepository.findAllAsync();
      if (!users || users.length === 0) {
        return ServiceResponse.failure('No Users found', null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<UserData[]>('Users found', users);
    } catch (ex) {
      const errorMessage = `Error finding all users: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while retrieving users.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByIdMySQL(id: number): Promise<ServiceResponse<UserData | null>> {
    try {
      const user = await this.mysqlRepository.findByIdAsync(id);
      if (!user) {
        return ServiceResponse.failure('User not found', null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<UserData>('User found', user);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding user.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createMySQL(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<ServiceResponse<UserData | null>> {
    try {
      // Check if email already exists
      const existingUser = await this.mysqlRepository.findByEmailAsync(data.email);
      if (existingUser) {
        return ServiceResponse.failure(
          'Email already exists',
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const user = await this.mysqlRepository.createAsync(data);
      return ServiceResponse.success<UserData>('User created successfully', user, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while creating user.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateMySQL(
    id: number,
    data: Partial<{ name: string; email: string; password: string }>
  ): Promise<ServiceResponse<UserData | null>> {
    try {
      const existingUser = await this.mysqlRepository.findByIdAsync(id);
      if (!existingUser) {
        return ServiceResponse.failure('User not found', null, StatusCodes.NOT_FOUND);
      }

      // Check if email already exists (if email is being updated)
      if (data.email && data.email !== existingUser.email) {
        const emailExists = await this.mysqlRepository.findByEmailAsync(data.email);
        if (emailExists) {
          return ServiceResponse.failure(
            'Email already exists',
            null,
            StatusCodes.BAD_REQUEST
          );
        }
      }

      const user = await this.mysqlRepository.updateAsync(id, data);
      if (!user) {
        return ServiceResponse.failure('Failed to update user', null, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      return ServiceResponse.success<UserData>('User updated successfully', user);
    } catch (ex) {
      const errorMessage = `Error updating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while updating user.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteMySQL(id: number): Promise<ServiceResponse<boolean | null>> {
    try {
      const existingUser = await this.mysqlRepository.findByIdAsync(id);
      if (!existingUser) {
        return ServiceResponse.failure('User not found', null, StatusCodes.NOT_FOUND);
      }

      const deleted = await this.mysqlRepository.deleteAsync(id);
      return ServiceResponse.success<boolean>('User deleted successfully', deleted);
    } catch (ex) {
      const errorMessage = `Error deleting user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while deleting user.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // MongoDB Methods
  async findAllMongoDB(): Promise<ServiceResponse<UserData[] | null>> {
    try {
      const users = await this.mongodbRepository.findAllAsync();
      if (!users || users.length === 0) {
        return ServiceResponse.failure('No Users found', null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<UserData[]>('Users found', users);
    } catch (ex) {
      const errorMessage = `Error finding all users: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while retrieving users.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByIdMongoDB(id: string): Promise<ServiceResponse<UserData | null>> {
    try {
      const user = await this.mongodbRepository.findByIdAsync(id);
      if (!user) {
        return ServiceResponse.failure('User not found', null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<UserData>('User found', user);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding user.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createMongoDB(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<ServiceResponse<UserData | null>> {
    try {
      // Check if email already exists
      const existingUser = await this.mongodbRepository.findByEmailAsync(data.email);
      if (existingUser) {
        return ServiceResponse.failure(
          'Email already exists',
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const user = await this.mongodbRepository.createAsync(data);
      return ServiceResponse.success<UserData>('User created successfully', user, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while creating user.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateMongoDB(
    id: string,
    data: Partial<{ name: string; email: string; password: string }>
  ): Promise<ServiceResponse<UserData | null>> {
    try {
      const existingUser = await this.mongodbRepository.findByIdAsync(id);
      if (!existingUser) {
        return ServiceResponse.failure('User not found', null, StatusCodes.NOT_FOUND);
      }

      // Check if email already exists (if email is being updated)
      if (data.email && data.email !== existingUser.email) {
        const emailExists = await this.mongodbRepository.findByEmailAsync(data.email);
        if (emailExists) {
          return ServiceResponse.failure(
            'Email already exists',
            null,
            StatusCodes.BAD_REQUEST
          );
        }
      }

      const user = await this.mongodbRepository.updateAsync(id, data);
      if (!user) {
        return ServiceResponse.failure('Failed to update user', null, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      return ServiceResponse.success<UserData>('User updated successfully', user);
    } catch (ex) {
      const errorMessage = `Error updating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while updating user.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteMongoDB(id: string): Promise<ServiceResponse<boolean | null>> {
    try {
      const existingUser = await this.mongodbRepository.findByIdAsync(id);
      if (!existingUser) {
        return ServiceResponse.failure('User not found', null, StatusCodes.NOT_FOUND);
      }

      const deleted = await this.mongodbRepository.deleteAsync(id);
      return ServiceResponse.success<boolean>('User deleted successfully', deleted);
    } catch (ex) {
      const errorMessage = `Error deleting user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while deleting user.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const userService = new UserService();
