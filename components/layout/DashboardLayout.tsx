'use client';

import { ReactNode } from 'react';
import { Flame, Clock } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  streakCount: number;
  dailyGoal: number;
  weeklyMinutesData: {
    day: string;
    minutes: number;
  }[];
}

export function DashboardLayout({
  children,
  currentView,
  onNavigate,
  streakCount,
  dailyGoal,
  weeklyMinutesData
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Main content area */}
      <div className="flex">
        {/* Navigation Rail */}
        <NavigationRail currentView={currentView} onNavigate={onNavigate} />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <header className="h-16 border-b border-[#1e293b] bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-10">
            <div className="h-full px-8 flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">
                {currentView === 'home' && 'Dashboard'}
                {currentView === 'resume' && 'Resume Learning'}
                {currentView === 'courses' && 'All Courses'}
                {currentView === 'stats' && 'Your Progress'}
                {currentView === 'settings' && 'Settings'}
              </h1>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6 overflow-auto h-[calc(100vh-4rem)]">
            {children}
          </div>
        </main>

        {/* Right Sidebar */}
        <RightSidebar
          streakCount={streakCount}
          dailyGoal={dailyGoal}
          weeklyMinutesData={weeklyMinutesData}
        />
      </div>
    </div>
  );
}

// Extracted NavigationRail component for layout reuse
function NavigationRail({ currentView, onNavigate }: {
  currentView: string;
  onNavigate: (view: string) => void;
}) {
  const navItems = [
    { id: 'home', label: 'Home', icon: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { id: 'resume', label: 'Resume', icon: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg> },
    { id: 'courses', label: 'Courses', icon: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
    { id: 'stats', label: 'Stats', icon: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg> },
    { id: 'settings', label: 'Settings', icon: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
  ];

  return (
    <nav className="flex flex-col items-center py-6 w-16 bg-[#0f172a] border-r border-[#1e293b]">
      <div className="flex flex-col items-center gap-2 w-full">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="group flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 w-full"
          >
            <item.icon size={22} className="text-[#64748b] group-hover:text-white transition-colors" />
            <span className="text-[10px] font-medium text-[#64748b] group-hover:text-white transition-colors">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// Extracted RightSidebar component for layout reuse
function RightSidebar({
  streakCount,
  dailyGoal,
  weeklyMinutesData
}: {
  streakCount: number;
  dailyGoal: number;
  weeklyMinutesData: { day: string; minutes: number }[];
}) {
  const progress = Math.min((streakCount / dailyGoal) * 100, 100);
  const maxMinutes = Math.max(...weeklyMinutesData.map(d => d.minutes), 60);

  return (
    <aside className="w-80 flex flex-col gap-6 p-4">
      {/* Streak Widget */}
      <div className="glass rounded-2xl p-6 card-hover">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#f8fafc] flex items-center gap-2">
            <Flame className="text-[#f59e0b]" size={20} />
            Daily Streak
          </h3>
          <span className="text-2xl font-bold text-[#f59e0b]">{streakCount}🔥</span>
        </div>
        <div className="relative h-3 bg-[#1e293b] rounded-full overflow-hidden mb-2">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#f59e0b] to-[#fb923c] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-[#94a3b8]">
          {streakCount} of {dailyGoal} minutes today
        </p>
      </div>

      {/* Weekly Minutes Chart */}
      <div className="glass rounded-2xl p-5 card-hover">
        <h3 className="font-semibold text-[#f8fafc] mb-4 flex items-center gap-2">
          <Clock size={20} className="text-[#6366f1]" />
          Weekly Minutes
        </h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyMinutesData.map((day) => {
            const height = (day.minutes / maxMinutes) * 100;
            return (
              <div key={day.day} className="flex flex-col items-center gap-2 flex-1">
                <div className="relative w-full flex items-end justify-center h-full">
                  <div
                    className="w-full max-w-[24px] rounded-t-lg bg-[#6366f1] transition-all duration-300"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs text-[#64748b]">{day.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
