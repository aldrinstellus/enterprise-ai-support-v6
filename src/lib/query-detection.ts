// Query Detection Module for Bhanu's Assistant-First Interface
// Maps natural language queries to appropriate widgets based on persona and intent

import type { WidgetType, WidgetData } from '@/types/widget';
import {
  executiveSummaryDemo,
  customerRiskProfileDemo,
  ticketDetailDemo,
  slaPerformanceChartDemo,
  agentPerformanceComparisonDemo,
  callPrepNotesDemo,
  responseComposerDemo,
  teamWorkloadDashboardDemo,
  customerRiskListDemo,
  ticketListDemo,
  agentDashboardDemo,
  meetingSchedulerDemo,
  similarTicketsAnalysisDemo,
  agentPerformanceStatsDemo,
  knowledgeBaseSearchDemo,
  knowledgeArticleDemo,
  messageComposerDemo,
} from '@/data/demo-widget-data';

export interface QueryMatch {
  widgetType: WidgetType;
  widgetData: WidgetData;
  responseText: string;
}

export type PersonaId = 'c-level' | 'cs-manager' | 'support-agent';

/**
 * Detect widget intent from user query
 */
export function detectWidgetQuery(
  query: string,
  personaId: PersonaId
): QueryMatch | null {
  const q = query.toLowerCase().trim();

  // Route based on persona
  switch (personaId) {
    case 'c-level':
      return detectCLevelQuery(q);
    case 'cs-manager':
      return detectManagerQuery(q);
    case 'support-agent':
      return detectAgentQuery(q);
    default:
      return null;
  }
}

// ============================================================================
// C-LEVEL EXECUTIVE QUERIES
// ============================================================================

function detectCLevelQuery(q: string): QueryMatch | null {
  // EXACT QUERY MATCHING (checked first - no ambiguity, no cache issues)
  // This ensures specific queries always get the right response
  const exactMatches: Record<string, QueryMatch> = {
    'show me the sla performance breakdown': {
      widgetType: 'sla-performance-chart',
      widgetData: slaPerformanceChartDemo,
      responseText: "Here's the detailed SLA performance breakdown: [v2]",
    },
    'which categories are we failing': {
      widgetType: 'sla-performance-chart',
      widgetData: slaPerformanceChartDemo,
      responseText: "We're currently failing in these SLA categories: [v2]",
    },
  };

  // Check for exact match first
  if (exactMatches[q]) {
    return exactMatches[q];
  }

  // PATTERN MATCHING (fallback for query variations)
  // 1. Executive Summary
  if (
    q.includes('executive summary') ||
    q.includes('system health') ||
    (q.includes('good morning') && q.includes('summary')) ||
    (q.includes('show me') && (q.includes('dashboard') || q.includes('summary')))
  ) {
    return {
      widgetType: 'executive-summary',
      widgetData: executiveSummaryDemo,
      responseText: "Good morning. Here's your executive summary for today:",
    };
  }

  // 2. Customer Risk Profile
  if (
    q.includes('tell me more about') ||
    q.includes('risk score') ||
    q.includes('why did') ||
    (q.includes('acme') && (q.includes('risk') || q.includes('increase')))
  ) {
    return {
      widgetType: 'customer-risk-profile',
      widgetData: customerRiskProfileDemo,
      responseText: "Let me pull up the detailed risk profile:",
    };
  }

  // 3a. SLA Failing Categories (specific query - check first)
  if (q.includes('which categories') && q.includes('failing')) {
    return {
      widgetType: 'sla-performance-chart',
      widgetData: slaPerformanceChartDemo,
      responseText: "We're currently failing in these SLA categories:",
    };
  }

  // 3b. SLA Performance Breakdown (general queries)
  if (
    q.includes('sla performance') ||
    q.includes('sla breakdown') ||
    (q.includes('show me') && q.includes('sla'))
  ) {
    return {
      widgetType: 'sla-performance-chart',
      widgetData: slaPerformanceChartDemo,
      responseText: "Here's the detailed SLA performance breakdown:",
    };
  }

  // 4. Meeting Scheduler
  if (
    q.includes('schedule') ||
    q.includes('book') ||
    (q.includes('executive call') && q.includes('attend'))
  ) {
    return {
      widgetType: 'meeting-scheduler',
      widgetData: meetingSchedulerDemo,
      responseText: "I've found available time slots for the executive call:",
    };
  }

  return null;
}

// ============================================================================
// CS MANAGER QUERIES
// ============================================================================

function detectManagerQuery(q: string): QueryMatch | null {
  // 1. Team Workload Dashboard
  if (
    q.includes("team's status") ||
    q.includes('team status') ||
    q.includes('show me my team') ||
    (q.includes('good morning') && q.includes('team'))
  ) {
    return {
      widgetType: 'team-workload-dashboard',
      widgetData: teamWorkloadDashboardDemo,
      responseText: "Here's your team's current workload status:",
    };
  }

  // 2. Agent Performance Comparison
  if (
    q.includes('top and bottom performers') ||
    q.includes('performance comparison') ||
    q.includes('top performers') ||
    q.includes('bottom performers') ||
    (q.includes('show me') && q.includes('performers'))
  ) {
    return {
      widgetType: 'agent-performance-comparison',
      widgetData: agentPerformanceComparisonDemo,
      responseText: "Here's the agent performance comparison for this week:",
    };
  }

  // 3. High-Risk Customers List
  if (
    q.includes('high-risk customers') ||
    q.includes('at-risk customers') ||
    (q.includes('show me all') && q.includes('risk'))
  ) {
    return {
      widgetType: 'customer-risk-list',
      widgetData: customerRiskListDemo,
      responseText: "Here's the list of all high-risk customers requiring attention:",
    };
  }

  // 4. Ticket List (for specific agent)
  if (
    (q.includes('show me') && q.includes('tickets')) ||
    q.includes('his tickets') ||
    q.includes('her tickets')
  ) {
    return {
      widgetType: 'ticket-list',
      widgetData: ticketListDemo,
      responseText: "Here are the agent's current tickets:",
    };
  }

  // 5. Meeting Scheduler (for 1-on-1)
  if (
    q.includes('schedule') && (q.includes('1-on-1') || q.includes('coaching'))
  ) {
    return {
      widgetType: 'meeting-scheduler',
      widgetData: meetingSchedulerDemo,
      responseText: "Here are available time slots for the 1-on-1 meeting:",
    };
  }

  // 6. Message Composer (for customer communication)
  if (
    q.includes('draft message') ||
    q.includes('compose message') ||
    q.includes('write email') ||
    (q.includes('message') && q.includes('customer'))
  ) {
    return {
      widgetType: 'message-composer',
      widgetData: messageComposerDemo,
      responseText: "I've drafted a message for you to review:",
    };
  }

  return null;
}

// ============================================================================
// SUPPORT AGENT QUERIES
// ============================================================================

function detectAgentQuery(q: string): QueryMatch | null {
  // 1. Agent Dashboard (daily overview)
  if (
    q.includes("what's on my plate") ||
    q.includes('my plate today') ||
    (q.includes('good morning') && !q.includes('summary'))
  ) {
    return {
      widgetType: 'agent-dashboard',
      widgetData: agentDashboardDemo,
      responseText: "Good morning! Here's what's on your plate today:",
    };
  }

  // 2. Ticket Detail
  if (
    q.includes('ticket #') ||
    q.includes('ticket number') ||
    (q.includes('show me ticket') && /\d+/.test(q)) ||
    (q.includes('details') && /\d+/.test(q))
  ) {
    return {
      widgetType: 'ticket-detail',
      widgetData: ticketDetailDemo,
      responseText: "Here are the complete details for this ticket:",
    };
  }

  // 3. Call Prep Notes
  if (
    q.includes('prepare for') && q.includes('call') ||
    q.includes('draft prep notes') ||
    q.includes('call preparation') ||
    q.includes('help me prepare')
  ) {
    return {
      widgetType: 'call-prep-notes',
      widgetData: callPrepNotesDemo,
      responseText: "I've prepared comprehensive notes for your upcoming call:",
    };
  }

  // 4. Response Composer
  if (
    q.includes('draft response') ||
    q.includes('draft a response') ||
    q.includes('help me respond') ||
    q.includes('compose response')
  ) {
    return {
      widgetType: 'response-composer',
      widgetData: responseComposerDemo,
      responseText: "I've drafted a response for you to review:",
    };
  }

  // 5. Ticket List (agent's own tickets)
  if (
    q.includes('my tickets') ||
    q.includes('tickets that need attention') ||
    (q.includes('show me') && q.includes('other tickets'))
  ) {
    return {
      widgetType: 'ticket-list',
      widgetData: ticketListDemo,
      responseText: "Here are your current tickets:",
    };
  }

  // 6. Similar Tickets Analysis
  if (
    q.includes('similar tickets') ||
    q.includes('learn the patterns') ||
    (q.includes('tickets i') && q.includes('resolved'))
  ) {
    return {
      widgetType: 'similar-tickets-analysis',
      widgetData: similarTicketsAnalysisDemo,
      responseText: "Here are patterns from similar tickets you've successfully resolved:",
    };
  }

  // 7. Agent Performance Stats
  if (
    q.includes('performance stats') ||
    q.includes('my stats') ||
    q.includes('my performance') ||
    (q.includes('show me') && q.includes('stats'))
  ) {
    return {
      widgetType: 'agent-performance-stats',
      widgetData: agentPerformanceStatsDemo,
      responseText: "Here's your performance summary for this week:",
    };
  }

  // 8. Knowledge Base Search
  if (
    q.includes('how do i troubleshoot') ||
    q.includes('how to') ||
    q.includes('how can i') ||
    q.includes('search kb') ||
    q.includes('knowledge base')
  ) {
    return {
      widgetType: 'knowledge-base-search',
      widgetData: knowledgeBaseSearchDemo,
      responseText: "I've searched the knowledge base for you:",
    };
  }

  // 9. Knowledge Article
  if (q.includes('open kb') || /kb-?\d+/.test(q)) {
    return {
      widgetType: 'knowledge-article',
      widgetData: knowledgeArticleDemo,
      responseText: "Here's the knowledge base article:",
    };
  }

  return null;
}
