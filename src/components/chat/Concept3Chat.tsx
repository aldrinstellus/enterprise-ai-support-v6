'use client';

import { useState, useEffect } from 'react';
import { InteractiveChat } from './InteractiveChat';
import { CommandPalette } from '../concepts/CommandPalette';
import { usePersona } from '@/hooks/use-persona';
import { getDashboardWidgets } from '@/config/dashboard-widgets';

export function Concept3Chat() {
  const { currentPersona } = usePersona();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const widgets = getDashboardWidgets(currentPersona.id);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K to toggle command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleWidgetClick = (query: string) => {
    // Trigger the query in InteractiveChat via URL parameter
    const url = new URL(window.location.href);
    url.searchParams.set('query', query);
    window.history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="relative h-screen">
      <InteractiveChat />

      {/* Floating Command Palette Button */}
      <button
        onClick={() => setIsPaletteOpen(true)}
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
        className="fixed bottom-[120px] right-8 flex items-center gap-2 px-4 py-3 hover:bg-white/25 backdrop-blur-xl border border-white/30 text-foreground rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
      >
        <span className="text-sm font-medium">Quick Launch</span>
        <kbd className="px-2 py-1 bg-muted/50 rounded text-xs">⌘K</kbd>
      </button>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        widgets={widgets}
        onWidgetClick={handleWidgetClick}
      />
    </div>
  );
}
