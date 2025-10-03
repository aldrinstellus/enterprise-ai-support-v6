import { Smile, Meh, Frown } from 'lucide-react';

interface SentimentAnalysisData {
  overall: 'positive' | 'neutral' | 'negative';
  score: number;
  breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recentComments: Array<{
    text: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    timestamp: string;
  }>;
}

export function SentimentAnalysisWidget({ data }: { data: SentimentAnalysisData }) {
  const sentimentConfig = {
    positive: {
      icon: Smile,
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/30',
    },
    neutral: {
      icon: Meh,
      color: 'text-chart-4',
      bg: 'bg-chart-4/10',
      border: 'border-chart-4/30',
    },
    negative: {
      icon: Frown,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      border: 'border-destructive/30',
    },
  };

  const config = sentimentConfig[data.overall];
  const Icon = config.icon;

  return (
    <div className="rounded-lg border border-border bg-card p-6 my-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Icon className={`h-5 w-5 ${config.color}`} />
        <h3 className="text-lg font-semibold text-foreground">Customer Sentiment</h3>
      </div>

      <div className="space-y-6">
        {/* Overall Score */}
        <div className={`${config.bg} border ${config.border} p-4 rounded-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground uppercase mb-1">
                Overall Sentiment
              </div>
              <div className={`text-xl font-semibold ${config.color} capitalize`}>
                {data.overall}
              </div>
            </div>
            <div className={`text-4xl font-bold ${config.color}`}>{data.score}%</div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground uppercase">Breakdown</div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-success font-medium">Positive</span>
                <span className="font-semibold">{data.breakdown.positive}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-success rounded-full transition-all duration-500"
                  style={{ width: `${data.breakdown.positive}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-chart-4 font-medium">Neutral</span>
                <span className="font-semibold">{data.breakdown.neutral}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-4 rounded-full transition-all duration-500"
                  style={{ width: `${data.breakdown.neutral}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-destructive font-medium">Negative</span>
                <span className="font-semibold">{data.breakdown.negative}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-destructive rounded-full transition-all duration-500"
                  style={{ width: `${data.breakdown.negative}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Comments */}
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground uppercase">Recent Feedback</div>
          <div className="space-y-3">
            {data.recentComments.map((comment, i) => {
              const commentConfig = sentimentConfig[comment.sentiment];
              const CommentIcon = commentConfig.icon;
              return (
                <div key={i} className="flex gap-3 text-sm">
                  <CommentIcon
                    className={`w-5 h-5 ${commentConfig.color} flex-shrink-0 mt-0.5`}
                  />
                  <div className="flex-1">
                    <div className="text-foreground">{comment.text}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {comment.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
