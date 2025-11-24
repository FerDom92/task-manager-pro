import {
  canManageProject,
  canEditProject,
  canCreateTasks,
  canDeleteProject,
} from '@/hooks/use-permissions';

describe('Permission helper functions', () => {
  describe('canManageProject', () => {
    it('returns true for OWNER', () => {
      expect(canManageProject('OWNER')).toBe(true);
    });

    it('returns true for ADMIN', () => {
      expect(canManageProject('ADMIN')).toBe(true);
    });

    it('returns false for MEMBER', () => {
      expect(canManageProject('MEMBER')).toBe(false);
    });

    it('returns false for VIEWER', () => {
      expect(canManageProject('VIEWER')).toBe(false);
    });

    it('returns false for null', () => {
      expect(canManageProject(null)).toBe(false);
    });
  });

  describe('canEditProject', () => {
    it('returns true for OWNER', () => {
      expect(canEditProject('OWNER')).toBe(true);
    });

    it('returns true for ADMIN', () => {
      expect(canEditProject('ADMIN')).toBe(true);
    });

    it('returns false for MEMBER', () => {
      expect(canEditProject('MEMBER')).toBe(false);
    });

    it('returns false for null', () => {
      expect(canEditProject(null)).toBe(false);
    });
  });

  describe('canCreateTasks', () => {
    it('returns true for OWNER', () => {
      expect(canCreateTasks('OWNER')).toBe(true);
    });

    it('returns true for ADMIN', () => {
      expect(canCreateTasks('ADMIN')).toBe(true);
    });

    it('returns true for MEMBER', () => {
      expect(canCreateTasks('MEMBER')).toBe(true);
    });

    it('returns false for VIEWER', () => {
      expect(canCreateTasks('VIEWER')).toBe(false);
    });

    it('returns false for null', () => {
      expect(canCreateTasks(null)).toBe(false);
    });
  });

  describe('canDeleteProject', () => {
    it('returns true for OWNER', () => {
      expect(canDeleteProject('OWNER')).toBe(true);
    });

    it('returns false for ADMIN', () => {
      expect(canDeleteProject('ADMIN')).toBe(false);
    });

    it('returns false for MEMBER', () => {
      expect(canDeleteProject('MEMBER')).toBe(false);
    });

    it('returns false for null', () => {
      expect(canDeleteProject(null)).toBe(false);
    });
  });
});
