/** Unwrap `{ success, data }` or return raw array/object from admin APIs. */
export function unwrapApiData<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'success' in payload &&
    (payload as { success: boolean }).success === true &&
    'data' in payload
  ) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export function unwrapApiList<T>(payload: unknown): T[] {
  const data = unwrapApiData<unknown>(payload);
  return Array.isArray(data) ? data : [];
}

/** ข้อความจาก body `{ success: false, error: { message } }` หรือ `{ message }` */
export function getApiErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return '';
  const o = payload as { error?: { message?: unknown }; message?: unknown };
  const em = o.error?.message;
  if (typeof em === 'string' && em.trim()) return em.trim();
  const m = o.message;
  if (typeof m === 'string' && m.trim()) return m.trim();
  return '';
}
