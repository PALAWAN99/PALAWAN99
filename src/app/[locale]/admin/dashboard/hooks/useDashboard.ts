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

export function useDashboard() {
  const [stats, setStats] = useState({
    members: { total: 0, active: 0 },
    gates: { total: 0, active: 0 },
    todayEvents: 0
  });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [gateTraffic, setGateTraffic] = useState<GateTrafficItem[]>([]);
  const [gateStatus, setGateStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setError(null);
      try {
        const [statsRes, eventsRes, detailsRes] = await Promise.all([
          fetch('/api/admin/dashboard/stats'),
          fetch('/api/admin/events?limit=5'),
          fetch('/api/admin/dashboard/details')
        ]);
        
        const statsData = await statsRes.json();
        const eventsData = await eventsRes.json();
        const detailsData = await detailsRes.json();
        
        setStats(statsData);
        if (Array.isArray(eventsData)) setRecentEvents(eventsData);
        if (detailsData.chartData) setChartData(detailsData.chartData);
        if (detailsData.gateTraffic) setGateTraffic(detailsData.gateTraffic);
        if (detailsData.gateStatus) setGateStatus(detailsData.gateStatus);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('ไม่สามารถโหลดข้อมูลแดชบอร์ดได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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
