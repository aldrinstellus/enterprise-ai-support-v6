import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { PerformanceTrendsData } from '@/types/widget';

export function PerformanceTrendsWidget({ data }: { data: PerformanceTrendsData }) {
  if (!data || !data.metrics || data.metrics.length === 0) {
    return (
      <div className="my-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <p className="text-sm text-destructive">Unable to load performance trends: Invalid data</p>
      </div>
    );
  }

  // Calculate trends
  const firstMetric = data.metrics[0];
  const lastMetric = data.metrics[data.metrics.length - 1];

  const responseTimeTrend =
    lastMetric.responseTime < firstMetric.responseTime ? 'improving' : 'declining';
  const resolutionTimeTrend =
    lastMetric.resolutionTime < firstMetric.resolutionTime ? 'improving' : 'declining';
  const satisfactionTrend =
    lastMetric.satisfaction > firstMetric.satisfaction ? 'improving' : 'declining';

  return (
    <div className="space-y-6 my-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Performance Trends
          </h3>
          <p className="text-sm text-muted-foreground">{data.period}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card rounded-lg border border-border bg-card/70 p-4 backdrop-blur-md">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.metrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              stroke="hsl(var(--border))"
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              stroke="hsl(var(--border))"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'hsl(var(--foreground))',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}
            />
            <Line
              type="monotone"
              dataKey="responseTime"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              name="Response Time (min)"
              dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="resolutionTime"
              stroke="hsl(var(--chart-4))"
              strokeWidth={2}
              name="Resolution Time (hr)"
              dot={{ fill: 'hsl(var(--chart-4))', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="satisfaction"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              name="Satisfaction (%)"
              dot={{ fill: 'hsl(var(--success))', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Response Time */}
        <div
          className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${
            responseTimeTrend === 'improving'
              ? 'border-success/30 bg-success/5'
              : 'border-destructive/30 bg-destructive/5'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              Response Time
            </span>
            {responseTimeTrend === 'improving' ? (
              <TrendingDown className="h-4 w-4 text-success" />
            ) : (
              <TrendingUp className="h-4 w-4 text-destructive" />
            )}
          </div>
          <div className="text-2xl font-bold text-foreground">
            {lastMetric.responseTime} min
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {responseTimeTrend === 'improving' ? 'Improving' : 'Needs attention'}
          </div>
        </div>

        {/* Resolution Time */}
        <div
          className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${
            resolutionTimeTrend === 'improving'
              ? 'border-success/30 bg-success/5'
              : 'border-destructive/30 bg-destructive/5'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              Resolution Time
            </span>
            {resolutionTimeTrend === 'improving' ? (
              <TrendingDown className="h-4 w-4 text-success" />
            ) : (
              <TrendingUp className="h-4 w-4 text-destructive" />
            )}
          </div>
          <div className="text-2xl font-bold text-foreground">
            {lastMetric.resolutionTime} hr
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {resolutionTimeTrend === 'improving' ? 'Improving' : 'Needs attention'}
          </div>
        </div>

        {/* Satisfaction */}
        <div
          className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${
            satisfactionTrend === 'improving'
              ? 'border-success/30 bg-success/5'
              : 'border-destructive/30 bg-destructive/5'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              Satisfaction
            </span>
            {satisfactionTrend === 'improving' ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </div>
          <div className="text-2xl font-bold text-foreground">{lastMetric.satisfaction}%</div>
          <div className="text-xs text-muted-foreground mt-1">
            {satisfactionTrend === 'improving' ? 'Improving' : 'Needs attention'}
          </div>
        </div>
      </div>
    </div>
  );
}
