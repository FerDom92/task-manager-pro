import { categoriesService } from '@/services/categories';
import { api } from '@/services/api';

jest.mock('@/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockApi = api as jest.Mocked<typeof api>;

describe('categoriesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('fetches all categories', async () => {
      const mockResponse = {
        data: [
          { id: '1', name: 'Work', color: '#FF0000' },
          { id: '2', name: 'Personal', color: '#00FF00' },
        ],
      };
      mockApi.get.mockResolvedValue(mockResponse);

      const result = await categoriesService.getAll();

      expect(mockApi.get).toHaveBeenCalledWith('/categories');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('create', () => {
    it('creates a new category', async () => {
      const categoryData = { name: 'New Category', color: '#0000FF' };
      const mockResponse = { data: { id: '3', ...categoryData } };
      mockApi.post.mockResolvedValue(mockResponse);

      const result = await categoriesService.create(categoryData);

      expect(mockApi.post).toHaveBeenCalledWith('/categories', categoryData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('delete', () => {
    it('deletes a category', async () => {
      mockApi.delete.mockResolvedValue({});

      await categoriesService.delete('123');

      expect(mockApi.delete).toHaveBeenCalledWith('/categories/123');
    });
  });
});
