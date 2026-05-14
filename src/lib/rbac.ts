import { UserRole } from '@prisma/client';

/**
 * นิยามของ Resource ที่มีการควบคุมสิทธิ์
 */
export type Resource = 
  | 'USER' 
  | 'GATE' 
  | 'BRANCH' 
  | 'MEMBER' 
  | 'QR_POLICY' 
  | 'QR_TOKEN' 
  | 'ACCESS_EVENT' 
  | 'AUDIT_LOG' 
  | 'DEVICE'
  | 'SETTING';

/**
 * Action ที่สามารถทำได้
 */
export type Action = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'MANAGE' | 'REVOKE' | 'ISSUE' | 'EXPORT';

/**
 * Permission Matrix: กำหนดว่าใครทำอะไรได้บ้าง
 */
const PERMISSIONS: Record<UserRole, Partial<Record<Resource, Action[]>>> = {
  SUPER_ADMIN: {
    USER: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    GATE: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    BRANCH: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    MEMBER: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    QR_POLICY: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    QR_TOKEN: ['ISSUE', 'REVOKE', 'READ'],
    ACCESS_EVENT: ['READ', 'EXPORT'],
    AUDIT_LOG: ['READ'],
    DEVICE: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'],
    SETTING: ['MANAGE'],
  },
  ADMIN: {
    USER: ['READ'],
    GATE: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    BRANCH: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    MEMBER: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    QR_POLICY: ['CREATE', 'READ', 'UPDATE'],
    QR_TOKEN: ['ISSUE', 'REVOKE', 'READ'],
    ACCESS_EVENT: ['READ', 'EXPORT'],
    DEVICE: ['CREATE', 'READ', 'UPDATE'],
  },
  LIBRARIAN: {
    MEMBER: ['CREATE', 'READ', 'UPDATE'],
    QR_TOKEN: ['ISSUE', 'READ'],
    ACCESS_EVENT: ['READ'],
    GATE: ['READ'],
  },
  STAFF: {
    MEMBER: ['READ'],
    QR_TOKEN: ['ISSUE', 'READ'],
    ACCESS_EVENT: ['READ'],
    GATE: ['READ'],
  },
  GATE_OFFICER: {
    ACCESS_EVENT: ['READ'],
    GATE: ['READ'],
    QR_TOKEN: ['ISSUE', 'READ'],
  },
  SECURITY: {
    ACCESS_EVENT: ['READ'],
    GATE: ['READ'],
  },
  VIEWER: {
    GATE: ['READ'],
    BRANCH: ['READ'],
    MEMBER: ['READ'],
    ACCESS_EVENT: ['READ'],
  },
};

/**
 * เช็คว่า Role ที่กำหนดมีสิทธิ์ทำ Action ใน Resource หรือไม่
 */
export function hasPermission(role: UserRole, resource: Resource, action: Action): boolean {
  const rolePermissions = PERMISSIONS[role];
  if (!rolePermissions) return false;

  const resourceActions = rolePermissions[resource];
  if (!resourceActions) return false;

  // ถ้ามี MANAGE คือทำได้ทุกอย่างใน Resource นั้น
  return resourceActions.includes(action) || resourceActions.includes('MANAGE');
}

/**
 * Helper สำหรับใช้งานใน Server Side (เช็คจาก session)
 */
export function checkAccess(session: { user?: { role?: UserRole } } | null, resource: Resource, action: Action): boolean {
  const role = session?.user?.role;
  if (!role) return false;
  return hasPermission(role, resource, action);
}
