'use client';

import { User, Plus, TrendingUp, AlertTriangle, BarChart3, Target, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onQuickAction?: (query: string) => void;
  onNewConversation?: () => void;
  onResetData?: () => void;
}

export function Sidebar({
  isOpen = true,
  onToggle,
  onQuickAction,
  onNewConversation,
  onResetData,
}: SidebarProps) {
  const pathname = usePathname();

  const personas = [
    { id: 'c-level', label: 'C-LEVEL', path: '/demo/c-level' },
    { id: 'cs-manager', label: 'CS MANAGER', path: '/demo/cs-manager' },
    { id: 'support-agent', label: 'SUPPORT AGENT', path: '/demo/support-agent' },
  ];

  const quickActions = [
    {
      id: 'sla',
      icon: Target,
      label: 'SLA Performance',
      value: '92%',
      query: 'Show me SLA performance breakdown',
    },
    {
      id: 'churn',
      icon: AlertTriangle,
      label: 'Churn Risk',
      badge: '5',
      badgeColor: 'bg-destructive text-destructive-foreground',
      query: 'Show me customer churn risk analysis',
    },
    {
      id: 'executive',
      icon: BarChart3,
      label: 'Executive Summary',
      badge: '94',
      badgeColor: 'bg-primary text-primary-foreground',
      query: 'Give me the executive summary',
    },
    {
      id: 'board',
      icon: TrendingUp,
      label: 'Board Metrics',
      badge: 'Ready',
      badgeColor: 'bg-chart-2 text-white',
      query: 'Show me board-level metrics',
    },
    {
      id: 'accounts',
      icon: Users,
      label: 'High-Value Accounts',
      badge: '18',
      badgeColor: 'bg-chart-2 text-white',
      query: 'Show me high-value account status',
    },
  ];

  const currentPersona = {
    name: 'Sarah Chen',
    role: 'Chief Executive Officer',
    email: 'sarah.chen@company.com',
    initials: 'SC',
  };

  return (
    <aside
      className={`h-screen bg-card border-r border-border transition-all duration-300 ${
        isOpen ? 'w-[300px]' : 'w-0'
      }`}
    >
      <div
        className={`flex h-full flex-col ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } transition-opacity duration-200`}
      >
      {/* New Conversation Button */}
      <div className="p-4 border-b border-border">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium text-foreground transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Conversation
        </button>
      </div>

      {/* Recent Conversations */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Recent Conversations
        </div>
        <div className="text-xs text-muted-foreground/60 py-4 text-center">
          No conversations yet
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Quick Actions
        </div>
        <div className="space-y-1">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onQuickAction?.(action.query)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                  <span className="text-sm text-foreground">{action.label}</span>
                </div>
                {action.value && (
                  <span className="text-sm font-medium text-foreground">{action.value}</span>
                )}
                {action.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${action.badgeColor}`}
                  >
                    {action.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Reset Data */}
      <div className="px-4 py-3 border-t border-border">
        <button
          onClick={onResetData}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset All Data
        </button>
      </div>

      {/* Persona Switcher */}
      <div className="px-4 py-3 border-t border-border">
        <div className="space-y-1">
          {personas.map((persona) => {
            const isActive = pathname === persona.path;
            return (
              <Link
                key={persona.id}
                href={persona.path}
                className={`block w-full px-4 py-2.5 rounded-lg text-sm font-medium text-center transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {persona.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3">
          <Avatar
            name={currentPersona.name}
            initials={currentPersona.initials}
            size={40}
            variant="profile"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">
              {currentPersona.name}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {currentPersona.email}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {currentPersona.role}
            </div>
          </div>
          <button className="p-1 hover:bg-muted rounded transition-colors">
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
      </div>
    </aside>
  );
}
