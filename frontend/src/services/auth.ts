import { api } from './api';
import type { AuthResponse, LoginDto, RegisterDto, User } from '@/types';

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async updateProfile(data: { firstName?: string; lastName?: string }): Promise<User> {
    const response = await api.patch<User>('/auth/me', data);
    return response.data;
  },

  async deleteAccount(): Promise<void> {
    await api.delete('/auth/me');
  },
};
