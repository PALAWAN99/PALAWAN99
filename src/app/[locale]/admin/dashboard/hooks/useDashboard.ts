import { useState, useEffect } from 'react';

export interface StatItem {
  titleKey: string;
  value: string;
  diff: number;
  icon: any;
  color: string;
}

export interface GateTrafficItem {
  name: string;
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
}

export interface GateStatusInfo {
  name: string;
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

export function useDashboard() {
  const [stats, setStats] = useState({
    members: { total: 0, active: 0 },
    gates: { total: 0, active: 0 },
    todayEvents: 0
  });
  const [recentEvents, setRecentEvents] = useState<DashboardEvent[]>([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [gateTraffic, setGateTraffic] = useState<GateTrafficItem[]>([]);
  const [gateStatus, setGateStatus] = useState<GateStatusInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchData(signal: AbortSignal) {
      setError(null);
      try {
        const [statsRes, eventsRes, detailsRes] = await Promise.all([
          fetch('/api/admin/dashboard/stats', { signal }),
          fetch('/api/admin/events?limit=5', { signal }),
          fetch('/api/admin/dashboard/details', { signal })
        ]);
        
        if (!statsRes.ok || !eventsRes.ok || !detailsRes.ok) return;

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
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch dashboard data:', error);
          setError('ไม่สามารถโหลดข้อมูลแดชบอร์ดได้ กรุณาลองใหม่อีกครั้ง');
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchData(controller.signal);
    
    return () => controller.abort();
  }, []);

  return {
    stats,
    recentEvents,
    chartData,
    gateTraffic,
    gateStatus,
    loading,
    error
  };
}
