import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage, unwrapApiData } from '@/lib/parse-api-response';
import type { PennuengGateHistoryResult, PennuengGateHistoryRow } from '@/types/pennueng-gate-history';
import type { GateHistoryRecordInput } from '@/validators/gateHistoryRecordValidator';

async function parseJson(res: Response) {
  return res.json() as Promise<unknown>;
}

async function assertOk(res: Response, json: unknown) {
  if (!res.ok) throw new Error(getApiErrorMessage(json) || res.statusText);
}

export async function fetchGateHistoryApi(params: {
  startDate: string;
  endDate: string;
  page?: number;
  gateId?: string | null;
  search?: string;
  memberNo?: string | null;
  pageSize?: number | 'all';
}): Promise<PennuengGateHistoryResult> {
  const q = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
    page: String(params.page ?? 1),
  });
  if (params.gateId) q.set('gateId', params.gateId);
  if (params.search) q.set('search', params.search);
  if (params.memberNo) q.set('memberNo', params.memberNo);
  if (params.pageSize === 'all') {
    q.set('all', '1');
  } else if (params.pageSize) {
    q.set('pageSize', String(params.pageSize));
  }

  const res = await fetch(apiPath(`/api/admin/history?${q}`));
  const json = await parseJson(res);
  await assertOk(res, json);
  return unwrapApiData<PennuengGateHistoryResult>(json);
}

export async function fetchAllGateHistoryApi(params: {
  startDate: string;
  endDate: string;
  gateId?: string | null;
  search?: string;
  memberNo?: string | null;
  pageSize?: number;
}): Promise<PennuengGateHistoryRow[]> {
  const pageSize = params.pageSize ?? 100;
  const all: PennuengGateHistoryRow[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const data = await fetchGateHistoryApi({ ...params, page, pageSize });
    all.push(...data.rows);
    totalPages = data.totalPages;
    page += 1;
  } while (page <= totalPages);

  return all;
}

export async function createGateHistoryRecordApi(
  data: GateHistoryRecordInput,
): Promise<PennuengGateHistoryRow> {
  const res = await fetch(apiPath('/api/admin/history'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await parseJson(res);
  await assertOk(res, json);
  return unwrapApiData<PennuengGateHistoryRow>(json);
}

export async function updateGateHistoryRecordApi(
  id: number,
  data: GateHistoryRecordInput,
): Promise<PennuengGateHistoryRow> {
  const res = await fetch(apiPath(`/api/admin/history/${id}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await parseJson(res);
  await assertOk(res, json);
  return unwrapApiData<PennuengGateHistoryRow>(json);
}

export async function deleteGateHistoryRecordApi(id: number): Promise<void> {
  const res = await fetch(apiPath(`/api/admin/history/${id}`), { method: 'DELETE' });
  const json = await parseJson(res);
  await assertOk(res, json);
}
