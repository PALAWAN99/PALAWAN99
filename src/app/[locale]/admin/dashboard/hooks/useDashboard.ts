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
  const [stats, setStats] = useState<{
    members: { total: number; active: number };
    gates: { total: number; active: number };
    todayEvents: number;
  } | null>(null);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [gateTraffic, setGateTraffic] = useState<GateTrafficItem[]>([]);
  const [gateStatus, setGateStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
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
    loading
  };
}
