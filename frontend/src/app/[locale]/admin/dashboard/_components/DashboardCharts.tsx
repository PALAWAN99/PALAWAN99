import { SimpleGrid, Card, Text, Center, Stack, Skeleton } from '@mantine/core';
import { IconDoor } from '@tabler/icons-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useRouter } from '@/i18n/routing';

import { ChartDataItem, GateTrafficItem } from '../hooks/useDashboard';
import { DrillDownFilters } from './DashboardDrillDownModal';

interface DashboardChartsProps {
  chartData: ChartDataItem[];
  gateTraffic: GateTrafficItem[];
  loading?: boolean;
  onDrillDown?: (filter: DrillDownFilters) => void;
  t: (key: string) => string;
}

export function DashboardCharts({
  chartData,
  gateTraffic,
  loading,
  onDrillDown,
  t,
}: DashboardChartsProps) {
  const router = useRouter();

  return (
    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
      {/* Traffic Chart */}
      <Card withBorder p="xl" radius="lg">
        <Text fw={700} mb="xl" size="lg">{t('Dashboard.trafficOverview')}</Text>
        <Skeleton visible={loading} radius="lg" h={300}>
          {!loading ? (
            <div style={{ height: 300, width: '100%', minWidth: 0, minHeight: 300 }}>
              <ResponsiveContainer width="100%" height={300} minWidth={0}>
                <AreaChart
                  data={chartData}
                  onClick={(data) => {
                    console.log('AreaChart click data:', data);
                    if (data && data.activeLabel) {
                      const label = String(data.activeLabel);
                      onDrillDown?.({
                        title: `รายชื่อผู้ผ่านเข้าออกช่วงเวลา ${label}`,
                        hourStr: label.includes(':') ? label : undefined,
                        dateStr: !label.includes(':') ? label : undefined,
                      });
                    }
                  }}
                  style={{ cursor: onDrillDown ? 'pointer' : 'default' }}
                >
                  <defs>
                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip />
                  <Area type="monotone" dataKey="in" stroke="#38BDF8" strokeWidth={3} fillOpacity={1} fill="url(#colorIn)" />
                  <Area type="monotone" dataKey="out" stroke="#10B981" strokeWidth={3} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </Skeleton>
      </Card>

      {/* Gate Traffic Bar Chart */}
      <Card withBorder p="xl" radius="lg">
        <Text fw={700} mb="xl" size="lg">{t('Dashboard.topGates')}</Text>
        <Skeleton visible={loading} radius="lg" h={300}>
          {!loading ? (
            <div style={{ height: 300, width: '100%', minWidth: 0, minHeight: 300 }}>
              {gateTraffic.length > 0 && gateTraffic[0].value > 0 ? (
                <ResponsiveContainer width="100%" height={300} minWidth={0}>
                  <BarChart data={gateTraffic} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" fontSize={11} width={148} tickLine={false} axisLine={false} />
                    <ChartTooltip cursor={{ fill: 'rgba(56, 189, 248, 0.05)' }} />
                    <Bar
                      dataKey="value"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                      onClick={(barData: any) => {
                        console.log('Top Gates bar click data:', barData);
                        const d = barData?.payload || barData;
                        if (d) {
                          if (onDrillDown) {
                            onDrillDown({
                              title: `รายชื่อผู้ผ่านประตู: ${d.name || d.code || ''}`,
                              gateId: d.code,
                            });
                          } else {
                            router.push(`/admin/events?gate=${encodeURIComponent(d.code ?? d.name ?? '')}`);
                          }
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {gateTraffic.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Center h={300}>
                  <Stack align="center" gap={4}>
                    <IconDoor size={40} opacity={0.2} />
                    <Text c="dimmed" size="sm">
                      {t('Common.noData')}
                    </Text>
                  </Stack>
                </Center>
              )}
            </div>
          ) : null}
        </Skeleton>
      </Card>
    </SimpleGrid>
  );
}
