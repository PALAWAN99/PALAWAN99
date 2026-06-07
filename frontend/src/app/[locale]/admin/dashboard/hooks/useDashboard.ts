import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage } from '@/lib/parse-api-response';
import type { PennuengDashboardPayload } from '@/types/pennueng-dashboard';
import type { DatesRangeValue } from '@mantine/dates';

export interface StatItem {
  titleKey: string;
  value: string;
  diff: number;
  icon: unknown;
  color: string;
}

export interface GateTrafficItem {
  name: string;
  code?: string;
  value: number;
  color: string;
}

export interface DashboardEvent {
  id: string;
  scannedAt: string;
  direction: 'IN' | 'OUT';
  decision: 'ALLOWED' | 'DENIED';
  member?: {
    firstNameTh: string;
    lastNameTh: string;
  };
  memberType?: string;
  gateName?: string;
  gateCode?: string;
}

export interface GateStatusInfo {
  name: string;
  code?: string;
  status: 'ACTIVE' | 'INACTIVE';
  in: number;
  out: number;
  lastScan: string;
}

export interface ChartDataItem {
  name: string;
  in: number;
  out: number;
}

function applyPennuengToDashboard(p: PennuengDashboardPayload) {
  return {
    stats: {
      members: p.stats.members,
      gates: p.stats.gates,
      todayEvents: p.stats.todayScans,
    },
    chartData: p.chartData,
    gateTraffic: p.gateTraffic,
    gateStatus: p.gateStatus as GateStatusInfo[],
    recentEvents: p.recentEvents as DashboardEvent[],
  };
}

export function useDashboard(dateRange: DatesRangeValue = [null, null]) {
  const [stats, setStats] = useState({
    members: { total: 0, active: 0 },
    gates: { total: 0, active: 0 },
    todayEvents: 0,
  });
  const [recentEvents, setRecentEvents] = useState<DashboardEvent[]>([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [gateTraffic, setGateTraffic] = useState<GateTrafficItem[]>([]);
  const [gateStatus, setGateStatus] = useState<GateStatusInfo[]>([]);
  const [pennueng, setPennueng] = useState<PennuengDashboardPayload | null>(null);
  const [pennuengLoading, setPennuengLoading] = useState(true);
  const [pennuengError, setPennuengError] = useState<string | null>(null);
  const [pennuengUnavailable, setPennuengUnavailable] = useState(false);
  const [dataSource, setDataSource] = useState<'qrgate' | 'pennueng'>('qrgate');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyPennueng = useCallback((p: PennuengDashboardPayload) => {
    const merged = applyPennuengToDashboard(p);
    setStats(merged.stats);
    setChartData(merged.chartData);
    setGateTraffic(merged.gateTraffic);
    setGateStatus(merged.gateStatus);
    setRecentEvents(merged.recentEvents);
    setDataSource('pennueng');
  }, []);
  const fetchPennueng = useCallback(async () => {
    setPennuengLoading(true);
    setPennuengUnavailable(false);
    setPennuengError(null);
    try {
      const res = await fetch(apiPath('/api/admin/dashboard/pennueng'));
      if (res.status === 503) {
        setPennuengUnavailable(true);
      } else if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const p = json.data as PennuengDashboardPayload;
          setPennueng(p);
          applyPennueng(p);
        }
      } else {
        const json = await res.json().catch(() => ({}));
        setPennuengError(getApiErrorMessage(json) || 'ไม่สามารถโหลดข้อมูล Pennueng ได้');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setPennuengError('ไม่สามารถโหลดข้อมูล Pennueng ได้');
      }
    } finally {
      setPennuengLoading(false);
    }
  }, [applyPennueng]);

  const refetchPennueng = useCallback(() => {
    void fetchPennueng();
  }, [fetchPennueng]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData(signal: AbortSignal) {
      setError(null);
      try {
        const qParams = new URLSearchParams();
        if (dateRange[0]) qParams.set('startDate', dayjs(dateRange[0]).format('YYYY-MM-DD'));
        if (dateRange[1]) qParams.set('endDate', dayjs(dateRange[1]).format('YYYY-MM-DD'));
        const qStr = qParams.toString() ? `?${qParams.toString()}` : '';

        const [statsRes, eventsRes, detailsRes, pennuengRes] = await Promise.all([
          fetch(apiPath(`/api/admin/dashboard/stats${qStr}`), { signal }),
          fetch(apiPath('/api/admin/events?limit=8'), { signal }),
          fetch(apiPath(`/api/admin/dashboard/details${qStr}`), { signal }),
          fetch(apiPath('/api/admin/dashboard/pennueng'), { signal }),
        ]);

        let pennuengData: PennuengDashboardPayload | null = null;

        if (pennuengRes.status === 503) {
          setPennuengUnavailable(true);
        } else if (pennuengRes.ok) {
          const pennuengJson = await pennuengRes.json();
          if (pennuengJson.success && pennuengJson.data) {
            pennuengData = pennuengJson.data as PennuengDashboardPayload;
            setPennueng(pennuengData);
            applyPennueng(pennuengData);
          }
        } else {
          const pennuengJson = await pennuengRes.json().catch(() => ({}));
          setPennuengError(getApiErrorMessage(pennuengJson) || 'ไม่สามารถโหลดข้อมูล Pennueng ได้');
        }

        if (!pennuengData && statsRes.ok && eventsRes.ok && detailsRes.ok) {
          const statsData = await statsRes.json();
          const eventsResult = await eventsRes.json();
          const detailsData = await detailsRes.json();

          if (statsData.success) setStats(statsData.data);

          if (eventsResult.success) {
            setRecentEvents(eventsResult.data.events || []);
          }

          if (detailsData.chartData) setChartData(detailsData.chartData);
          if (detailsData.gateTraffic) setGateTraffic(detailsData.gateTraffic);
          if (detailsData.gateStatus) setGateStatus(detailsData.gateStatus);
          setDataSource('qrgate');
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Failed to fetch dashboard data:', err);
          setError('ไม่สามารถโหลดข้อมูลแดชบอร์ดได้ กรุณาลองใหม่อีกครั้ง');
        }
      } finally {
        setLoading(false);
        setPennuengLoading(false);
      }
    }

    fetchData(controller.signal);

    return () => controller.abort();
  }, [applyPennueng, dateRange]);

  return {
    stats,
    recentEvents,
    chartData,
    gateTraffic,
    gateStatus,
    pennueng,
    pennuengLoading,
    pennuengError,
    pennuengUnavailable,
    dataSource,
    loading,
    error,
    refetchPennueng,
  };
}
