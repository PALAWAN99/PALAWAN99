'use client';

import dayjs from 'dayjs';
import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage, unwrapApiData } from '@/lib/parse-api-response';
import type { ReportGateOption, ReportsAnalyticsPayload } from '@/types/reports-analytics';

export async function fetchReportGatesApi(): Promise<ReportGateOption[]> {
  const res = await fetch(apiPath('/api/admin/reports/gates'));
  const payload = await res.json();
  if (!res.ok) {
    throw new Error(getApiErrorMessage(payload) || 'Failed to load gates');
  }
  const data = unwrapApiData<{ gates: ReportGateOption[] }>(payload);
  return data.gates ?? [];
}

export async function fetchReportsAnalyticsApi(params: {
  startDate: string;
  endDate: string;
  gateIds: string[];
}): Promise<ReportsAnalyticsPayload> {
  const qs = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  });
  if (params.gateIds.length > 0) {
    qs.set('gateIds', params.gateIds.join(','));
  }
  const res = await fetch(apiPath(`/api/admin/reports/stats?${qs.toString()}`));
  const payload = await res.json();
  if (!res.ok) {
    throw new Error(getApiErrorMessage(payload) || 'Failed to load report');
  }
  return unwrapApiData<ReportsAnalyticsPayload>(payload);
}

export function defaultReportRange() {
  return {
    startDate: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  };
}
