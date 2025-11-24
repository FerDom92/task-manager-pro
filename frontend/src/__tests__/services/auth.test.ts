import { authService } from '@/services/auth';
import { api } from '@/services/api';

jest.mock('@/services/api', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockApi = api as jest.Mocked<typeof api>;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('sends POST request to /auth/login', async () => {
      const mockResponse = {
        data: {
          user: { id: '1', email: 'test@example.com' },
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      };
      mockApi.post.mockResolvedValue(mockResponse);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('register', () => {
    it('sends POST request to /auth/register', async () => {
      const mockResponse = {
        data: {
          user: { id: '1', email: 'test@example.com' },
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      };
      mockApi.post.mockResolvedValue(mockResponse);

      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(mockApi.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('refreshToken', () => {
    it('sends POST request to /auth/refresh', async () => {
      const mockResponse = {
        data: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      };
      mockApi.post.mockResolvedValue(mockResponse);

      const result = await authService.refreshToken('old-refresh-token');

      expect(mockApi.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: 'old-refresh-token',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getProfile', () => {
    it('sends GET request to /auth/me', async () => {
      const mockResponse = {
        data: { id: '1', email: 'test@example.com', firstName: 'Test' },
      };
      mockApi.get.mockResolvedValue(mockResponse);

      const result = await authService.getProfile();

      expect(mockApi.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateProfile', () => {
    it('sends PATCH request to /auth/me', async () => {
      const mockResponse = {
        data: { id: '1', email: 'test@example.com', firstName: 'Updated' },
      };
      mockApi.patch.mockResolvedValue(mockResponse);

      const result = await authService.updateProfile({ firstName: 'Updated' });

      expect(mockApi.patch).toHaveBeenCalledWith('/auth/me', {
        firstName: 'Updated',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteAccount', () => {
    it('sends DELETE request to /auth/me', async () => {
      mockApi.delete.mockResolvedValue({});

      await authService.deleteAccount();

      expect(mockApi.delete).toHaveBeenCalledWith('/auth/me');
    });
  });
});
