import client from '@/lib/client';
import type { LoginCredentials, LoginResponse } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await client.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return data.responseObject;
  },
};
