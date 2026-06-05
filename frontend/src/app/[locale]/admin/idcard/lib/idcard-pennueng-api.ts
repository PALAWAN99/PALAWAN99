import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage, unwrapApiData } from '@/lib/parse-api-response';
import type {
  PennuengMember,
  PennuengMemberKey,
  PennuengMemberKeyWithMember,
  PennuengMemberTypeOption,
} from '@/types/pennueng-member';
import type { PennuengMemberInput } from '@/validators/pennuengMemberValidator';

async function parseJson(res: Response) {
  return res.json() as Promise<unknown>;
}

async function assertOk(res: Response, json: unknown) {
  if (!res.ok) throw new Error(getApiErrorMessage(json) || res.statusText);
}

export async function lookupPennuengByCitizenApi(citizenId: string): Promise<{
  found: boolean;
  member: PennuengMember | null;
  groupDetail: string | null;
}> {
  const id = citizenId.replace(/\D/g, '');
  const res = await fetch(
    apiPath(`/api/admin/idcard/pennueng-lookup?citizenId=${encodeURIComponent(id)}`),
  );
  const json = await parseJson(res);
  await assertOk(res, json);
  return unwrapApiData<{ found: boolean; member: PennuengMember | null; groupDetail: string | null }>(
    json,
  );
}

export async function lookupMemberKeyApi(key: string): Promise<{
  found: boolean;
  row: PennuengMemberKeyWithMember | null;
}> {
  const res = await fetch(
    apiPath(`/api/admin/idcard/member-key?key=${encodeURIComponent(key)}`),
  );
  const json = await parseJson(res);
  await assertOk(res, json);
  return unwrapApiData<{ found: boolean; row: PennuengMemberKeyWithMember | null }>(json);
}

export async function fetchIdCardMemberTypesApi(): Promise<PennuengMemberTypeOption[]> {
  const res = await fetch(apiPath('/api/admin/pennueng-members?types=1'));
  const json = await parseJson(res);
  await assertOk(res, json);
  const data = unwrapApiData<{ types: PennuengMemberTypeOption[] }>(json);
  return data.types ?? [];
}

export async function registerPennuengFromIdCardApi(
  data: PennuengMemberInput & { accessKey?: string | null; keyExpireDate?: string | null },
): Promise<{ member: PennuengMember; key: PennuengMemberKey | null }> {
  const res = await fetch(apiPath('/api/admin/idcard/pennueng-register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await parseJson(res);
  await assertOk(res, json);
  return unwrapApiData<{ member: PennuengMember; key: PennuengMemberKey | null }>(json);
}

export async function issueTempQrApi(params: {
  memberNo: string;
  policyId?: string | null;
}): Promise<{
  qrContent: string;
  expiresAt: string;
  memberKey?: string;
}> {
  const searchRes = await fetch(
    apiPath(`/api/qr/member-search?memberNo=${encodeURIComponent(params.memberNo)}`),
  );
  const searchJson = await parseJson(searchRes);
  await assertOk(searchRes, searchJson);
  const { member } = unwrapApiData<{ member: { id: string; memberNo: string } }>(searchJson);

  const res = await fetch(apiPath('/api/qr/issue'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      memberId: member.id,
      memberNo: member.memberNo,
      purpose: 'ENTRY',
      temporary: true,
      policyId: params.policyId ?? undefined,
    }),
  });
  const json = await parseJson(res);
  await assertOk(res, json);
  return unwrapApiData<{ qrContent: string; expiresAt: string; memberKey?: string }>(json);
}

export async function fetchDefaultQrPolicyIdApi(): Promise<string | null> {
  const res = await fetch(apiPath('/api/admin/qr-policies'));
  if (!res.ok) return null;
  const policies = (await res.json()) as { id: string; isDefault?: boolean }[];
  if (!Array.isArray(policies) || policies.length === 0) return null;
  const def = policies.find((p) => p.isDefault) ?? policies[0];
  return def?.id ?? null;
}

export async function searchPennuengMembersBriefApi(
  q: string,
): Promise<PennuengMember[]> {
  const res = await fetch(
    apiPath(`/api/admin/pennueng-members?search=${encodeURIComponent(q)}&limit=10`),
  );
  const json = await parseJson(res);
  await assertOk(res, json);
  const data = unwrapApiData<{ members: PennuengMember[] }>(json);
  return data.members ?? [];
}
