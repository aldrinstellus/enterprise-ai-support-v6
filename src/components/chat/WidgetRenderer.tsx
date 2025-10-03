import { ExecutiveSummaryWidget } from '@/components/widgets/ExecutiveSummaryWidget';
import { AnalyticsDashboardWidget } from '@/components/widgets/AnalyticsDashboardWidget';
import { DashboardWidget } from '@/components/widgets/DashboardWidget';
import { SentimentAnalysisWidget } from '@/components/widgets/SentimentAnalysisWidget';
import { EscalationPathWidget } from '@/components/widgets/EscalationPathWidget';
import { MeetingConfirmationWidget } from '@/components/widgets/MeetingConfirmationWidget';
import { SLAPerformanceChartWidget } from '@/components/widgets/SLAPerformanceChartWidget';

// Import other widgets as needed
// Note: Some widgets may not exist yet and will need to be created

interface WidgetRendererProps {
  widgetType: string;
  data: any;
}

export function WidgetRenderer({ widgetType, data }: WidgetRendererProps) {
  switch (widgetType) {
    case 'executive-summary':
      return <ExecutiveSummaryWidget data={data} />;

    case 'analytics-dashboard':
      return <AnalyticsDashboardWidget data={data} />;

    case 'dashboard':
      return <DashboardWidget data={data} />;

    case 'sentiment-analysis':
      return <SentimentAnalysisWidget data={data} />;

    case 'escalation-path':
      return <EscalationPathWidget data={data} />;

    case 'meeting-confirmation':
      return <MeetingConfirmationWidget data={data} />;

    case 'sla-performance-chart':
      return <SLAPerformanceChartWidget data={data} />;

    // Placeholder for widgets that need to be created
    case 'customer-risk-profile':
      return (
        <div className="rounded-lg border border-border bg-card p-6 my-4">
          <div className="text-sm text-muted-foreground">
            Customer Risk Profile widget (to be implemented)
          </div>
          <pre className="mt-2 text-xs">{JSON.stringify(data, null, 2)}</pre>
        </div>
      );

    case 'meeting-scheduler':
      return (
        <div className="rounded-lg border border-border bg-card p-6 my-4">
          <div className="text-sm text-muted-foreground">
            Meeting Scheduler widget (to be implemented)
          </div>
          <pre className="mt-2 text-xs">{JSON.stringify(data, null, 2)}</pre>
        </div>
      );

    default:
      return (
        <div className="rounded-lg border border-border bg-card p-6 my-4">
          <div className="text-sm text-destructive">Unknown widget type: {widgetType}</div>
        </div>
      );
  }
}
