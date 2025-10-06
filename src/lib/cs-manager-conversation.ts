// CS Manager Conversation Patterns
// Multi-turn conversation flows for CS Manager persona

import type { WidgetType, WidgetData } from '@/types/widget';
import {
  meetingSchedulerDemo,
  teamWorkloadDashboardDemo,
  agentPerformanceComparisonDemo,
  slaPerformanceChartDemo,
  performanceTrendsDemo,
  customerRiskListDemo,
  ticketListDemo,
  sentimentAnalysisDemo,
  analyticsDashboardDemo,
} from '@/data/demo-widget-data';

export interface ConversationEntry {
  id: string;
  triggers: string[];
  userQuery: string;
  aiResponse: string;
  widgetType?: any;
  widgetData?: any;
}

// Helper to get tomorrow's date
function getTomorrow(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

const conversationEntries: ConversationEntry[] = [
  // Q1: Schedule 1-on-1 (Initial Request - AI Response Only)
  {
    id: 'q1-schedule-1on1',
    triggers: ['schedule 1-on-1', 'schedule a 1-on-1', 'coaching session with'],
    userQuery: 'Schedule a 1-on-1 coaching session with Marcus',
    aiResponse:
      "I can help you schedule a 1-on-1 with Marcus. The session will be 30 minutes.\n\nWould you like me to check both of your calendars for availability?",
  },

  // Q2: Check availability (Show Calendar)
  {
    id: 'q2-check-availability',
    triggers: [
      // Affirmative responses (for Q1 "Would you like me to check calendars?" follow-up)
      'yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'please', 'go ahead', 'proceed',
      // Explicit triggers
      'find time', 'availability', 'check calendar',
    ],
    userQuery: 'Yes, check availability',
    aiResponse: "I've checked both calendars. Here are the available time slots:",
    widgetType: 'meeting-scheduler',
    widgetData: {
      ...meetingSchedulerDemo,
      title: 'Schedule 1-on-1 with Marcus',
      type: '1-on-1 Coaching Session',
      duration: '30 minutes',
      attendees: [
        {
          name: 'You (CS Manager)',
          status: 'organizer',
          required: true,
        },
        {
          name: 'Marcus Johnson (Support Agent)',
          status: 'available',
          required: true,
        },
      ],
    },
  },

  // Q3: Book Meeting (Confirmation)
  {
    id: 'q3-book-meeting',
    triggers: ['book', 'confirm', 'schedule', 'tomorrow', '1pm', '13:00', '2pm', '14:00', '10am'],
    userQuery: 'Book the tomorrow at 1pm slot.',
    aiResponse: 'Perfect! 1-on-1 session confirmed and calendar invite sent.',
    widgetType: 'meeting-confirmation',
    widgetData: {
      meetingDate: getTomorrow(),
      meetingTime: '1:00 PM',
      timezone: 'PST',
      duration: '30 minutes',
      location: 'Video Conference',
      invitesSent: [
        { name: 'Marcus Johnson', email: 'marcus.johnson@company.com', role: 'Support Agent' },
      ],
      briefingCreated: true,
      briefingItems: [
        'Performance metrics for last 30 days',
        'Recent tickets handled',
        'Customer feedback summary',
        'Development goals discussion',
      ],
      agendaItems: [
        'Review performance metrics and trends',
        'Discuss recent challenging tickets',
        'Address any blockers or support needs',
        'Set goals for next quarter',
        'Career development discussion',
      ],
    },
  },

  // Message Composer Actions
  {
    id: 'q4-send-message',
    triggers: ['send the message', 'send message', 'send it'],
    userQuery: 'Send the message',
    aiResponse: '✓ Message sent to Acme Corp successfully! They should receive it within the next few minutes. I\'ve also added this to your sent items.',
  },

  {
    id: 'q5-save-draft',
    triggers: ['save as draft', 'save draft'],
    userQuery: 'Save as draft',
    aiResponse: '✓ Message saved as draft. You can find it in your Drafts folder and continue editing later.',
  },

  {
    id: 'q6-save-template',
    triggers: ['save as template', 'save template'],
    userQuery: 'Save as template',
    aiResponse: '✓ Message saved as template "Customer Outage Response". You can reuse this template for similar customer communications in the future.',
  },

  // NEW Q&A #1: Team Workload Dashboard
  {
    id: 'q7-team-workload',
    triggers: ['team workload', 'team capacity', 'workload dashboard', 'team distribution', 'agent workload'],
    userQuery: 'Show me the current team workload distribution',
    aiResponse: "Here's the real-time team workload dashboard. David Park is currently overloaded at 120% capacity and needs immediate support. I recommend redistributing tickets to Sarah Chen and Aisha Williams who have available capacity:",
    widgetType: 'team-workload-dashboard',
    widgetData: teamWorkloadDashboardDemo,
  },

  // NEW Q&A #2: Agent Performance Comparison
  {
    id: 'q8-agent-performance',
    triggers: ['agent performance', 'compare agents', 'team performance', 'top performers', 'performance comparison'],
    userQuery: 'Compare agent performance for this month',
    aiResponse: "Here's the agent performance comparison for the last 30 days. Sarah Chen leads the team with 95% SLA compliance and 4.8 customer satisfaction. Tom Anderson may need additional support and coaching:",
    widgetType: 'agent-performance-comparison',
    widgetData: agentPerformanceComparisonDemo,
  },

  // NEW Q&A #3: SLA Performance Chart
  {
    id: 'q9-sla-performance',
    triggers: ['sla performance', 'sla compliance', 'sla metrics', 'sla breaches', 'service level'],
    userQuery: 'Show me SLA performance breakdown',
    aiResponse: "Here's the SLA performance analysis. Overall compliance is at 87%, which is below our 90% target. Critical resolution times are declining at 72% compliance - this needs immediate attention:",
    widgetType: 'sla-performance-chart',
    widgetData: slaPerformanceChartDemo,
  },

  // NEW Q&A #4: Performance Trends
  {
    id: 'q10-performance-trends',
    triggers: ['performance trends', 'trends over time', 'weekly performance', 'performance chart'],
    userQuery: 'Show me performance trends for the past week',
    aiResponse: "Here's the performance trends for the last 7 days. Response times are showing some volatility, with spikes on Dec 16 and Dec 19. Customer satisfaction dipped to 82% mid-week but is recovering:",
    widgetType: 'performance-trends',
    widgetData: performanceTrendsDemo,
  },

  // NEW Q&A #5: Customer Risk List
  {
    id: 'q11-customer-risk-list',
    triggers: ['at-risk customers', 'customer risk', 'high-risk accounts', 'customers at risk', 'risk list'],
    userQuery: 'Show me all at-risk customers',
    aiResponse: "Here are your 8 high-risk customers requiring immediate attention. Acme Corporation tops the list with a risk score of 92 and contract renewal in just 45 days:",
    widgetType: 'customer-risk-list',
    widgetData: customerRiskListDemo,
  },

  // NEW Q&A #6: Critical Tickets
  {
    id: 'q12-critical-tickets',
    triggers: ['critical tickets', 'urgent tickets', 'high priority', 'tickets at risk'],
    userQuery: 'What critical tickets need attention?',
    aiResponse: "Here are all critical and high-priority tickets requiring immediate attention. Two tickets have already breached SLA and need escalation:",
    widgetType: 'ticket-list',
    widgetData: ticketListDemo,
  },

  // NEW Q&A #7: Sentiment Analysis
  {
    id: 'q13-sentiment-analysis',
    triggers: ['customer sentiment', 'sentiment trends', 'how are customers feeling', 'feedback sentiment'],
    userQuery: 'What is the overall customer sentiment?',
    aiResponse: "Based on recent customer feedback and interactions, the overall sentiment is negative at 45%. The main pain points are authentication issues, data export problems, and API rate limiting:",
    widgetType: 'sentiment-analysis',
    widgetData: sentimentAnalysisDemo,
  },

  // NEW Q&A #8: Analytics Dashboard
  {
    id: 'q14-analytics-dashboard',
    triggers: ['show analytics', 'analytics dashboard', 'detailed metrics', 'ticket analytics'],
    userQuery: 'Show me the detailed analytics dashboard',
    aiResponse: "Here's your comprehensive analytics dashboard showing ticket volume trends, response time patterns, and resolution breakdown for the week:",
    widgetType: 'analytics-dashboard',
    widgetData: analyticsDashboardDemo,
  },
];

/**
 * Find best matching conversation entry for CS Manager queries using scoring algorithm
 */
export function findBestMatch(userInput: string): ConversationEntry | null {
  const normalizedInput = userInput.toLowerCase().trim();

  const scoredMatches = conversationEntries
    .map((entry) => {
      const matchedTriggers = entry.triggers.filter((trigger) =>
        normalizedInput.includes(trigger.toLowerCase())
      );

      if (matchedTriggers.length === 0) return null;

      // Score calculation:
      // - Longer trigger phrases score higher (more specific)
      // - Multiple matches boost score by 10 per match
      const score =
        matchedTriggers.reduce((sum, trigger) => sum + trigger.length, 0) +
        matchedTriggers.length * 10;

      return { entry, score, matchCount: matchedTriggers.length };
    })
    .filter((match) => match !== null);

  if (scoredMatches.length === 0) return null;

  // Sort by score descending and return highest match
  scoredMatches.sort((a, b) => b!.score - a!.score);
  return scoredMatches[0]!.entry;
}
