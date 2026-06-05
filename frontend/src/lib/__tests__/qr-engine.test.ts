import { beforeAll, describe, expect, it, vi } from 'vitest';
import crypto from 'crypto';

// Setup env variables before importing env/qr-engine to pass Zod schema validation
beforeAll(() => {
  process.env.QR_SECRET = 'a_very_long_secure_qr_secret_key_at_least_32_characters';
  process.env.DATABASE_URL = 'postgresql://localhost:5432/db';
  process.env.AUTH_SECRET = 'auth_secret';
});

// Mock Prisma client
vi.mock('../prisma', () => {
  return {
    prisma: {
      qrToken: {
        findUnique: vi.fn(),
      },
      gate: {
        findUnique: vi.fn(),
      },
    },
  };
});

import { prisma } from '../prisma';
import { generateToken, validateQrToken } from '../qr-engine';

describe('QR Engine tests', () => {
  const mockMemberId = 'member-123';
  const mockGateId = 'gate-456';
  const secretKey = 'a_very_long_secure_qr_secret_key_at_least_32_characters';

  it('generateToken should return a token and its correct sha256 hash', () => {
    const result = generateToken(mockMemberId);
    expect(result.token).toBeDefined();
    expect(result.hash).toBeDefined();

    // Verify hashing format
    const expectedHash = crypto.createHash('sha256').update(result.token).digest('hex');
    expect(result.hash).toBe(expectedHash);

    // Verify token parts format: v1:memberId:timestamp:nonce:signature
    const parts = result.token.split(':');
    expect(parts).toHaveLength(5);
    expect(parts[0]).toBe('v1');
    expect(parts[1]).toBe(mockMemberId);
  });

  it('validateQrToken: happy path', async () => {
    const { token } = generateToken(mockMemberId);

    // Mock Database lookups
    const mockQrToken = {
      id: 'token-id-1',
      tokenHash: crypto.createHash('sha256').update(token).digest('hex'),
      memberId: mockMemberId,
      revokedAt: null,
      usedAt: null,
      expiresAt: new Date(Date.now() + 3600 * 1000), // Expires in 1 hour
      member: {
        id: mockMemberId,
        status: 'ACTIVE',
        memberNo: 'MEMBER-001',
      },
    };

    const mockGate = {
      id: mockGateId,
      gateCode: 'GATE-01',
      status: 'ACTIVE',
    };

    vi.mocked(prisma.qrToken.findUnique).mockResolvedValue(mockQrToken as any);
    vi.mocked(prisma.gate.findUnique).mockResolvedValue(mockGate as any);

    const validationResult = await validateQrToken(token, mockGateId);
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.decision).toBe('ALLOWED');
    expect(validationResult.member?.status).toBe('ACTIVE');
    expect(validationResult.gate?.status).toBe('ACTIVE');
  });

  it('validateQrToken: invalid format', async () => {
    const validationResult = await validateQrToken('invalid-token-string', mockGateId);
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.reason).toBe('INVALID_FORMAT');
  });

  it('validateQrToken: wrong signature', async () => {
    const { token } = generateToken(mockMemberId);
    // Alter the signature at the end
    const badToken = token.slice(0, -4) + 'abcd';

    const validationResult = await validateQrToken(badToken, mockGateId);
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.reason).toBe('INVALID_SIGNATURE');
  });

  it('validateQrToken: expired rotating token (>60s)', async () => {
    vi.useFakeTimers();
    // Generate token under the current fake system time
    const { token } = generateToken(mockMemberId);

    // Advance time by 70 seconds to make the token expired
    vi.advanceTimersByTime(70 * 1000);

    const validationResult = await validateQrToken(token, mockGateId);
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.reason).toBe('QR_EXPIRED');

    vi.useRealTimers();
  });

  it('validateQrToken: usedAt not null (already used)', async () => {
    const { token } = generateToken(mockMemberId);

    const mockQrToken = {
      id: 'token-id-1',
      tokenHash: crypto.createHash('sha256').update(token).digest('hex'),
      memberId: mockMemberId,
      revokedAt: null,
      usedAt: new Date(), // Already used
      expiresAt: new Date(Date.now() + 3600 * 1000),
      member: {
        id: mockMemberId,
        status: 'ACTIVE',
      },
    };

    vi.mocked(prisma.qrToken.findUnique).mockResolvedValue(mockQrToken as any);

    const validationResult = await validateQrToken(token, mockGateId);
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.reason).toBe('ALREADY_USED');
  });

  it('validateQrToken: member inactive', async () => {
    const { token } = generateToken(mockMemberId);

    const mockQrToken = {
      id: 'token-id-1',
      tokenHash: crypto.createHash('sha256').update(token).digest('hex'),
      memberId: mockMemberId,
      revokedAt: null,
      usedAt: null,
      expiresAt: new Date(Date.now() + 3600 * 1000),
      member: {
        id: mockMemberId,
        status: 'INACTIVE', // Inactive member
      },
    };

    vi.mocked(prisma.qrToken.findUnique).mockResolvedValue(mockQrToken as any);

    const validationResult = await validateQrToken(token, mockGateId);
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.reason).toBe('MEMBER_INACTIVE');
  });

  it('validateQrToken: gate disabled', async () => {
    const { token } = generateToken(mockMemberId);

    const mockQrToken = {
      id: 'token-id-1',
      tokenHash: crypto.createHash('sha256').update(token).digest('hex'),
      memberId: mockMemberId,
      revokedAt: null,
      usedAt: null,
      expiresAt: new Date(Date.now() + 3600 * 1000),
      member: {
        id: mockMemberId,
        status: 'ACTIVE',
      },
    };

    const mockGate = {
      id: mockGateId,
      gateCode: 'GATE-01',
      status: 'DISABLED', // Disabled gate
    };

    vi.mocked(prisma.qrToken.findUnique).mockResolvedValue(mockQrToken as any);
    vi.mocked(prisma.gate.findUnique).mockResolvedValue(mockGate as any);

    const validationResult = await validateQrToken(token, mockGateId);
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.reason).toBe('GATE_DISABLED');
  });
});
