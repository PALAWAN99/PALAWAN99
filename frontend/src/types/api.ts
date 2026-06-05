export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse {
  data?: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type AccessDirection = 'IN' | 'OUT' | 'BIDIRECTIONAL';
export type AccessDecision = 'ALLOWED' | 'DENIED';
export type MemberStatus = 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'REVOKED';
