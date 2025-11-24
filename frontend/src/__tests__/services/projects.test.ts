import { projectsService } from '@/services/projects';
import { api } from '@/services/api';

jest.mock('@/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockApi = api as jest.Mocked<typeof api>;

describe('projectsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('fetches all projects', async () => {
      const mockResponse = {
        data: [
          { id: '1', name: 'Project 1' },
          { id: '2', name: 'Project 2' },
        ],
      };
      mockApi.get.mockResolvedValue(mockResponse);

      const result = await projectsService.getAll();

      expect(mockApi.get).toHaveBeenCalledWith('/projects');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getOne', () => {
    it('fetches a single project', async () => {
      const mockResponse = {
        data: { id: '123', name: 'Test Project', description: 'Description' },
      };
      mockApi.get.mockResolvedValue(mockResponse);

      const result = await projectsService.getOne('123');

      expect(mockApi.get).toHaveBeenCalledWith('/projects/123');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('create', () => {
    it('creates a new project', async () => {
      const projectData = { name: 'New Project', description: 'New Description' };
      const mockResponse = { data: { id: '1', ...projectData } };
      mockApi.post.mockResolvedValue(mockResponse);

      const result = await projectsService.create(projectData);

      expect(mockApi.post).toHaveBeenCalledWith('/projects', projectData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('update', () => {
    it('updates a project', async () => {
      const updateData = { name: 'Updated Project' };
      const mockResponse = { data: { id: '123', ...updateData } };
      mockApi.patch.mockResolvedValue(mockResponse);

      const result = await projectsService.update('123', updateData);

      expect(mockApi.patch).toHaveBeenCalledWith('/projects/123', updateData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('delete', () => {
    it('deletes a project', async () => {
      mockApi.delete.mockResolvedValue({});

      await projectsService.delete('123');

      expect(mockApi.delete).toHaveBeenCalledWith('/projects/123');
    });
  });

  describe('getTasks', () => {
    it('fetches tasks for a project', async () => {
      const mockResponse = {
        data: [
          { id: '1', title: 'Task 1', projectId: '123' },
          { id: '2', title: 'Task 2', projectId: '123' },
        ],
      };
      mockApi.get.mockResolvedValue(mockResponse);

      const result = await projectsService.getTasks('123');

      expect(mockApi.get).toHaveBeenCalledWith('/projects/123/tasks');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('addMember', () => {
    it('adds a member to a project', async () => {
      mockApi.post.mockResolvedValue({});

      await projectsService.addMember('proj-1', 'user-1', 'MEMBER');

      expect(mockApi.post).toHaveBeenCalledWith('/projects/proj-1/members', {
        userId: 'user-1',
        role: 'MEMBER',
      });
    });
  });

  describe('removeMember', () => {
    it('removes a member from a project', async () => {
      mockApi.delete.mockResolvedValue({});

      await projectsService.removeMember('proj-1', 'member-1');

      expect(mockApi.delete).toHaveBeenCalledWith(
        '/projects/proj-1/members/member-1'
      );
    });
  });
});
