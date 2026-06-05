import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage } from '@/lib/parse-api-response';
import type { MemberFormData } from '../types';

export function formToMemberApiBody(values: MemberFormData) {
  return {
    memberNo: values.memberNo.trim(),
    citizenId: values.citizenId?.trim() || '',
    firstNameTh: values.firstNameTh.trim(),
    lastNameTh: values.lastNameTh.trim(),
    firstNameEn: values.firstNameEn?.trim() || '',
    lastNameEn: values.lastNameEn?.trim() || '',
    email: values.email?.trim() || '',
    phone: values.phone?.trim() || '',
    memberType: values.memberType,
    status: values.status,
    expireDate: values.expireDate || '',
    metadata: {
      prefixTh: values.prefixTh || '',
      prefixEn: values.prefixEn || '',
      birthDate: values.birthDate || '',
      gender: values.gender || '',
      address: values.address || '',
      school: values.school || '',
    },
  };
}

export async function fetchMembersApi(params: {
  search: string;
  page: number;
  filterType: string | null;
  filterStatus: string | null;
}) {
  const typeParam = params.filterType ? `&type=${encodeURIComponent(params.filterType)}` : '';
  const statusParam = params.filterStatus ? `&status=${encodeURIComponent(params.filterStatus)}` : '';
  const res = await fetch(
    apiPath(
      `/api/admin/members?search=${encodeURIComponent(params.search)}&page=${params.page}&limit=20${typeParam}${statusParam}`,
    ),
  );
  const json = await res.json();
  if (!res.ok) throw new Error(getApiErrorMessage(json));
  return json.data as { members: unknown[]; total: number; pages: number };
}

export async function createMemberApi(values: MemberFormData) {
  const res = await fetch(apiPath('/api/admin/members'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formToMemberApiBody(values)),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(getApiErrorMessage(json));
  return json;
}

export async function updateMemberApi(id: string, values: MemberFormData) {
  const res = await fetch(apiPath(`/api/admin/members/${id}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formToMemberApiBody(values)),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(getApiErrorMessage(json));
  return json;
}

export async function deleteMemberApi(id: string) {
  const res = await fetch(apiPath(`/api/admin/members/${id}`), { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw new Error(getApiErrorMessage(json));
  return json;
}
