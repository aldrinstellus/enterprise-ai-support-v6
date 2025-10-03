'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, PanelLeft, PanelLeftClose, Copy, Check, RotateCw, ThumbsUp, ThumbsDown, Download } from 'lucide-react';
import { findBestMatch } from '@/lib/c-level-conversation';
import { WidgetRenderer } from './WidgetRenderer';
import { useQuickAction } from '@/contexts/QuickActionContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Avatar } from '@/components/ui/Avatar';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'widget';
  content?: string;
  widgetType?: string;
  widgetData?: any;
  timestamp: Date;
  feedback?: 'like' | 'dislike';
  userQuery?: string; // Store the original query for regeneration
}

export function InteractiveChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { quickActionQuery } = useQuickAction();
  const { sidebarOpen, toggleSidebar } = useSidebar();

  // Detect if user is at bottom of scroll container
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      // Consider "at bottom" if within 100px
      const atBottom = distanceFromBottom < 100;
      setIsAtBottom(atBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // No auto-scroll - user has full manual control

  // Handle Quick Action queries from sidebar
  useEffect(() => {
    if (quickActionQuery) {
      setInputValue(quickActionQuery);
      // Auto-submit after setting the value
      setTimeout(() => {
        const form = inputRef.current?.closest('form');
        form?.requestSubmit();
      }, 100);
    }
  }, [quickActionQuery]);

  // Simulate typing animation for AI responses
  const simulateTyping = async (text: string): Promise<void> => {
    setIsTyping(true);
    // Simulate realistic typing delay (30-50ms per character)
    const delay = Math.min(1500, text.length * 35);
    await new Promise((resolve) => setTimeout(resolve, delay));
    setIsTyping(false);
  };

  // Action handlers
  const handleCopy = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleRegenerate = (query: string) => {
    // Find the last user message with this query
    const lastIndex = messages.findLastIndex(msg => msg.content === query && msg.type === 'user');
    if (lastIndex !== -1) {
      // Remove all messages after the user query
      setMessages(prev => prev.slice(0, lastIndex + 1));
      // Re-submit the query
      setTimeout(() => {
        const match = findBestMatch(query);
        if (match) {
          handleMatch(match, query);
        }
      }, 100);
    }
  };

  const handleFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, feedback: msg.feedback === feedback ? undefined : feedback }
          : msg
      )
    );
  };

  const handleDownload = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to handle matched responses
  const handleMatch = async (match: any, query: string) => {
    await simulateTyping(match.aiResponse);

    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      type: 'ai',
      content: match.aiResponse,
      timestamp: new Date(),
      userQuery: query,
    };
    setMessages((prev) => [...prev, aiMessage]);

    if (match.widgetType && match.widgetData) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const widgetMessage: Message = {
        id: `widget-${Date.now()}`,
        type: 'widget',
        widgetType: match.widgetType,
        widgetData: match.widgetData,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, widgetMessage]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    // Add user message
    setMessages((prev) => [...prev, userMessage]);
    const query = inputValue;
    setInputValue('');

    // Find matching response
    const match = findBestMatch(query);

    if (match) {
      await handleMatch(match, query);
    } else {
      // No match found - helpful response
      await simulateTyping('I can help with that.');
      const fallbackMessage: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content:
          "I'm not sure I understood that. Try asking about:\n- Executive summary\n- Analytics\n- Acme Corp risk\n- Sentiment analysis\n- Escalation path\n- SLA performance\n- Schedule a meeting",
        timestamp: new Date(),
        userQuery: query,
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    }

    // Refocus input
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute left-4 top-4 z-10 flex items-center justify-center rounded-lg border border-border bg-card p-2 hover:bg-muted transition-all"
        title={`${sidebarOpen ? 'Close' : 'Open'} sidebar (⌘B)`}
      >
        {sidebarOpen ? (
          <PanelLeftClose className="h-5 w-5 text-muted-foreground" />
        ) : (
          <PanelLeft className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {/* Messages Container */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && !isTyping && (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
              <h1 className="text-4xl md:text-5xl font-medium text-foreground mb-3">
                AI that <span className="italic">actually</span> gets work done
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-md">
                Connect your tools. Ask AI. Watch it happen.
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === 'user' && (
                  <div className="flex gap-3 justify-end">
                    <div className="max-w-2xl">
                      <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-sm">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 text-right">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <Avatar
                      name="Sarah Chen"
                      size={32}
                      variant="chat"
                    />
                  </div>
                )}

                {message.type === 'ai' && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary via-chart-3 to-primary/80 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="max-w-2xl flex-1">
                      <div className="bg-gradient-to-br from-primary/8 via-accent/15 to-chart-3/10 rounded-2xl border border-primary/25 shadow-md overflow-hidden">
                        {/* Message Content */}
                        <div className="px-4 py-3">
                          <p className="text-sm whitespace-pre-wrap text-foreground">
                            {message.content}
                          </p>
                        </div>

                        {/* Action Bar Footer */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-background/40 border-t border-primary/10">
                        <button
                          onClick={() => handleCopy(message.id, message.content!)}
                          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedMessageId === message.id ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-success" />
                              <span className="text-success">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        {message.userQuery && (
                          <button
                            onClick={() => handleRegenerate(message.userQuery!)}
                            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                            title="Regenerate response"
                          >
                            <RotateCw className="h-3.5 w-3.5" />
                            <span>Regenerate</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDownload(message.content!)}
                          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                          title="Download response"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleFeedback(message.id, 'like')}
                            className={`rounded-md p-1.5 transition-colors ${
                              message.feedback === 'like'
                                ? 'bg-success/10 text-success'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                            title="Good response"
                          >
                            <ThumbsUp className={`h-3.5 w-3.5 ${message.feedback === 'like' ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, 'dislike')}
                            className={`rounded-md p-1.5 transition-colors ${
                              message.feedback === 'dislike'
                                ? 'bg-destructive/10 text-destructive'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                            title="Poor response"
                          >
                            <ThumbsDown className={`h-3.5 w-3.5 ${message.feedback === 'dislike' ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        <span className="ml-auto text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      </div>
                    </div>
                  </div>
                )}

                {message.type === 'widget' && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 flex-shrink-0" />
                    <div className="max-w-4xl w-full">
                      <WidgetRenderer
                        widgetType={message.widgetType!}
                        data={message.widgetData}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary via-chart-3 to-primary/80 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gradient-to-br from-primary/8 via-accent/15 to-chart-3/10 px-4 py-3 rounded-2xl rounded-tl-sm border border-primary/25 shadow-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom, centered */}
      <div className="border-t border-border bg-card px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What would you like to do?"
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              Send
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
