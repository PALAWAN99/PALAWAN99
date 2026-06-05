import { describe, expect, it } from 'vitest';
import { hasPermission, checkAccess } from '../rbac';
import { UserRole } from '@prisma/client';

describe('RBAC - hasPermission', () => {
  it('SUPER_ADMIN should have defined permissions in the matrix', () => {
    // SUPER_ADMIN has CREATE, READ, UPDATE, DELETE on USER
    expect(hasPermission('SUPER_ADMIN', 'USER', 'CREATE')).toBe(true);
    expect(hasPermission('SUPER_ADMIN', 'USER', 'DELETE')).toBe(true);
    
    // SUPER_ADMIN has MANAGE on SETTING
    expect(hasPermission('SUPER_ADMIN', 'SETTING', 'MANAGE')).toBe(true);

    // SUPER_ADMIN has ISSUE, REVOKE, READ on QR_TOKEN
    expect(hasPermission('SUPER_ADMIN', 'QR_TOKEN', 'ISSUE')).toBe(true);
    expect(hasPermission('SUPER_ADMIN', 'QR_TOKEN', 'REVOKE')).toBe(true);
    expect(hasPermission('SUPER_ADMIN', 'QR_TOKEN', 'READ')).toBe(true);
  });

  it('VIEWER should only have READ permissions', () => {
    // VIEWER permissions are explicitly:
    // GATE: READ, BRANCH: READ, MEMBER: READ, ACCESS_EVENT: READ
    expect(hasPermission('VIEWER', 'GATE', 'READ')).toBe(true);
    expect(hasPermission('VIEWER', 'BRANCH', 'READ')).toBe(true);
    expect(hasPermission('VIEWER', 'MEMBER', 'READ')).toBe(true);
    expect(hasPermission('VIEWER', 'ACCESS_EVENT', 'READ')).toBe(true);

    // Other actions should be false
    expect(hasPermission('VIEWER', 'GATE', 'CREATE')).toBe(false);
    expect(hasPermission('VIEWER', 'MEMBER', 'DELETE')).toBe(false);
    expect(hasPermission('VIEWER', 'ACCESS_EVENT', 'EXPORT')).toBe(false);
  });

  it('GATE_OFFICER should only have permissions for gate operations', () => {
    // GATE_OFFICER has ACCESS_EVENT: READ, GATE: READ, QR_TOKEN: ISSUE, READ
    expect(hasPermission('GATE_OFFICER', 'GATE', 'READ')).toBe(true);
    expect(hasPermission('GATE_OFFICER', 'ACCESS_EVENT', 'READ')).toBe(true);
    expect(hasPermission('GATE_OFFICER', 'QR_TOKEN', 'ISSUE')).toBe(true);
    expect(hasPermission('GATE_OFFICER', 'QR_TOKEN', 'READ')).toBe(true);

    // Should not have UPDATE or DELETE permissions on GATE
    expect(hasPermission('GATE_OFFICER', 'GATE', 'UPDATE')).toBe(false);
    expect(hasPermission('GATE_OFFICER', 'GATE', 'DELETE')).toBe(false);
  });

  it('unknown role should return false for all permissions', () => {
    // cast to UserRole to test unknown role
    const invalidRole = 'UNKNOWN_ROLE' as UserRole;
    expect(hasPermission(invalidRole, 'GATE', 'READ')).toBe(false);
  });
});

describe('RBAC - checkAccess helper', () => {
  it('should return false if session is null or has no role', () => {
    expect(checkAccess(null, 'GATE', 'READ')).toBe(false);
    expect(checkAccess({}, 'GATE', 'READ')).toBe(false);
    expect(checkAccess({ user: {} }, 'GATE', 'READ')).toBe(false);
  });

  it('should return true if session user has role with permission', () => {
    const session = { user: { role: 'SUPER_ADMIN' as UserRole } };
    expect(checkAccess(session, 'GATE', 'CREATE')).toBe(true);
  });
});
