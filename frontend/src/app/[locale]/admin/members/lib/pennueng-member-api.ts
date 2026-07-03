import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage, unwrapApiData } from '@/lib/parse-api-response';
import type {
  PennuengMember,
  PennuengMemberKey,
  PennuengMemberListResult,
  PennuengMemberSoftDeleteRow,
  PennuengMemberTypeOption,
} from '@/types/pennueng-member';
import type { PennuengMemberInput, PennuengMemberUpdateInput } from '@/validators/pennuengMemberValidator';
import type { PennuengMemberSortField } from '@/lib/pennueng-members';

async function parseJson(res: Response) {
  return res.json() as Promise<unknown>;
}

async function assertOk(res: Response, json: unknown) {
  if (!res.ok) throw new Error(getApiErrorMessage(json) || res.statusText);
}

export async function fetchPennuengMemberTypesApi(): Promise<PennuengMemberTypeOption[]> {
  const res = await fetch(apiPath('/api/admin/pennueng-members?types=1'));
  const json = await parseJson(res);
  await assertOk(res, json);
  const data = unwrapApiData<{ types: PennuengMemberTypeOption[] }>(json);
  return data.types ?? [];
}

export async function fetchPennuengMembersApi(params: {
  search?: string;
  page?: number;
  limit?: number;
  memberType?: string | null;
  sortBy?: PennuengMemberSortField;
  sortDir?: 'asc' | 'desc';
}): Promise<PennuengMemberListResult & { isMock?: boolean }> {
  const q = new URLSearchParams();
  if (params.search) q.set('search', params.search);
  if (params.page) q.set('page', String(params.page));
  if (params.limit) q.set('limit', String(params.limit));
  if (params.memberType) q.set('type', params.memberType);
  if (params.sortBy) q.set('sortBy', params.sortBy);
  if (params.sortDir) q.set('sortDir', params.sortDir);

  const res = await fetch(apiPath(`/api/admin/pennueng-members?${q}`));
  const json = await parseJson(res);
  await assertOk(res, json);
  const isMock = !!(json && typeof json === 'object' && 'mock' in json && (json as { mock?: boolean }).mock);
  const data = unwrapApiData<PennuengMemberListResult>(json);
  return { ...data, isMock };
}

export async function createPennuengMemberApi(data: PennuengMemberInput): Promise<PennuengMember> {
  const res = await fetch(apiPath('/api/admin/pennueng-members'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await parseJson(res);
  await assertOk(res, json);
  return unwrapApiData<PennuengMember>(json);
}

export async function updatePennuengMemberApi(
  memberNo: string,
  data: PennuengMemberUpdateInput,
): Promise<PennuengMember> {
  const res = await fetch(apiPath(`/api/admin/pennueng-members/${encodeURIComponent(memberNo)}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await parseJson(res);
  await assertOk(res, json);
  return unwrapApiData<PennuengMember>(json);
}

export async function softDeletePennuengMemberApi(memberNo: string): Promise<void> {
  const res = await fetch(apiPath(`/api/admin/pennueng-members/${encodeURIComponent(memberNo)}`), {
    method: 'DELETE',
  });
  const json = await parseJson(res);
  await assertOk(res, json);
}

export async function deletePennuengMemberPermanentlyApi(memberNo: string): Promise<void> {
  const res = await fetch(
    apiPath(`/api/admin/pennueng-members/${encodeURIComponent(memberNo)}?permanent=true`),
    {
      method: 'DELETE',
    },
  );
  const json = await parseJson(res);
  await assertOk(res, json);
}

export async function fetchPennuengDeletedApi(params: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ rows: PennuengMemberSoftDeleteRow[]; total: number; pages: number; page: number }> {
  const q = new URLSearchParams();
  if (params.search) q.set('search', params.search);
  if (params.page) q.set('page', String(params.page));
  if (params.limit) q.set('limit', String(params.limit));

  const res = await fetch(apiPath(`/api/admin/pennueng-members/deleted?${q}`));
  const json = await parseJson(res);
  await assertOk(res, json);
  return unwrapApiData<{ rows: PennuengMemberSoftDeleteRow[]; total: number; pages: number; page: number }>(
    json,
  );
}

export async function restorePennuengMemberApi(memberNo: string): Promise<PennuengMember> {
  const res = await fetch(
    apiPath(`/api/admin/pennueng-members/${encodeURIComponent(memberNo)}/restore`),
    { method: 'POST' },
  );
  const json = await parseJson(res);
  await assertOk(res, json);
  return unwrapApiData<PennuengMember>(json);
}

export async function fetchPennuengMemberKeysApi(
  memberNo: string,
): Promise<{ memberNo: string; keys: PennuengMemberKey[] }> {
  const res = await fetch(
    apiPath(`/api/admin/pennueng-members/${encodeURIComponent(memberNo)}/keys`),
  );
  const json = await parseJson(res);
  await assertOk(res, json);
  return unwrapApiData<{ memberNo: string; keys: PennuengMemberKey[] }>(json);
}

export async function updatePennuengMemberKeyApi(
  memberNo: string,
  seqNo: number,
  data: { memberKey?: string; expireDate?: string | null },
): Promise<PennuengMemberKey> {
  const res = await fetch(
    apiPath(
      `/api/admin/pennueng-members/${encodeURIComponent(memberNo)}/keys/${seqNo}`,
    ),
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  );
  const json = await parseJson(res);
  await assertOk(res, json);
  return unwrapApiData<PennuengMemberKey>(json);
}

export async function deletePennuengMemberKeyApi(
  memberNo: string,
  seqNo: number,
): Promise<void> {
  const res = await fetch(
    apiPath(
      `/api/admin/pennueng-members/${encodeURIComponent(memberNo)}/keys/${seqNo}`,
    ),
    { method: 'DELETE' },
  );
  const json = await parseJson(res);
  await assertOk(res, json);
}
