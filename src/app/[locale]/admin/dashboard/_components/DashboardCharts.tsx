import { SimpleGrid, Card, Text, Center, Stack } from '@mantine/core';
import { IconDoor } from '@tabler/icons-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useRouter } from '@/i18n/routing';

interface DashboardChartsProps {
  chartData: any[];
  gateTraffic: any[];
  t: (key: string) => string;
}

export function DashboardCharts({ chartData, gateTraffic, t }: DashboardChartsProps) {
  const router = useRouter();

  return (
    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
      {/* Traffic Chart */}
      <Card withBorder p="xl" radius="lg">
        <Text fw={700} mb="xl" size="lg">{t('Dashboard.trafficOverview')}</Text>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
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
      </Card>

      {/* Gate Traffic Bar Chart */}
      <Card withBorder p="xl" radius="lg">
        <Text fw={700} mb="xl" size="lg">{t('Dashboard.topGates')}</Text>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            {gateTraffic.length > 0 && gateTraffic[0].value > 0 ? (
              <BarChart data={gateTraffic} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" fontSize={12} width={80} tickLine={false} axisLine={false} />
                <ChartTooltip cursor={{fill: 'rgba(56, 189, 248, 0.05)'}} />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                  onClick={(data: any) => data && router.push(`/admin/events?gate=${data.name}`)}
                >
                  {gateTraffic.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <Center h="100%">
                <Stack align="center" gap={4}>
                  <IconDoor size={40} opacity={0.2} />
                  <Text c="dimmed" size="sm">{t('Common.noData')}</Text>
                </Stack>
              </Center>
            )}
          </ResponsiveContainer>
        </div>
      </Card>
    </SimpleGrid>
  );
}
