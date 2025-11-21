import { api } from './api';
import type { AuthResponse, LoginDto, RegisterDto, User } from '@/types';

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },
};
