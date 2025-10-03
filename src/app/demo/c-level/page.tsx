'use client';

import { useState } from 'react';
import { InteractiveChatWithFloatingInput } from '@/components/chat/InteractiveChatWithFloatingInput';
import { QuickActionProvider } from '@/contexts/QuickActionContext';
import { SidebarProvider } from '@/contexts/SidebarContext';

export default function CLevelDemoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <QuickActionProvider>
      <SidebarProvider value={{ sidebarOpen, toggleSidebar }}>
        <InteractiveChatWithFloatingInput />
      </SidebarProvider>
    </QuickActionProvider>
  );
}
