import 'server-only';

import { isSqlServerConfigured } from '@/lib/sqlserver';
import {
  fetchPennuengReportGateOptions,
  fetchPennuengReportsAnalytics,
} from '@/lib/pennueng-reports-analytics';
import {
  fetchPostgresReportGateOptions,
  fetchPostgresReportsAnalytics,
} from '@/lib/postgres-reports-analytics';
import type { ReportGateOption, ReportsAnalyticsPayload, ReportsAnalyticsQuery } from '@/types/reports-analytics';

export async function fetchReportGateOptions(): Promise<ReportGateOption[]> {
  if (isSqlServerConfigured()) {
    return fetchPennuengReportGateOptions();
  }
  return fetchPostgresReportGateOptions();
}

export async function fetchReportsAnalytics(
  query: ReportsAnalyticsQuery,
): Promise<ReportsAnalyticsPayload> {
  if (isSqlServerConfigured()) {
    return fetchPennuengReportsAnalytics(query);
  }
  return fetchPostgresReportsAnalytics(query);
}
