import { afterEach, describe, expect, it, vi } from 'vitest';

const authMock = vi.fn();
vi.mock('@/auth', () => ({ auth: () => authMock() }));

function makeRequest(ip: string) {
  return new Request('http://localhost/api/admin/example', {
    headers: { 'x-forwarded-for': ip },
  });
}

describe('checkRateLimit — identifier resolution', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('groups requests from the same logged-in user even across different IPs', async () => {
    authMock.mockResolvedValue({ user: { id: 'user-shared-nat' } });
    const { checkRateLimit } = await import('../rate-limit');

    let limited = false;
    for (let i = 0; i < 5; i += 1) {
      const res = await checkRateLimit(makeRequest(`10.0.0.${i}`), 3);
      if (res) limited = true;
    }

    // Same session user hitting from different NAT-assigned IPs should still
    // share one bucket — otherwise IP-based limiting is trivially bypassed
    // and, worse, unrelated staff behind the same campus NAT get throttled
    // by each other's traffic.
    expect(limited).toBe(true);
  });

  it('falls back to per-IP limiting when there is no session (public endpoints)', async () => {
    authMock.mockResolvedValue(null);
    const { checkRateLimit } = await import('../rate-limit');

    const resA1 = await checkRateLimit(makeRequest('203.0.113.10'), 1);
    const resB1 = await checkRateLimit(makeRequest('203.0.113.20'), 1);
    const resA2 = await checkRateLimit(makeRequest('203.0.113.10'), 1);

    expect(resA1).toBeUndefined();
    expect(resB1).toBeUndefined();
    expect(resA2).toBeDefined(); // second request from the same IP is limited
  });
});
