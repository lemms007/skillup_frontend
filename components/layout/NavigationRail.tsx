'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  BarChart2,
  Settings,
  Flame,
  PlayCircle
} from 'lucide-react';

interface NavigationRailProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function NavigationRail({ currentView, onNavigate }: NavigationRailProps) {
  const pathname = usePathname();

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      id: 'home',
      href: '/',
      description: 'Dashboard'
    },
    {
      icon: PlayCircle,
      label: 'Resume',
      id: 'resume',
      href: '/resume',
      description: 'Continue learning'
    },
    {
      icon: BookOpen,
      label: 'Courses',
      id: 'courses',
      href: '/courses',
      description: 'All courses'
    },
    {
      icon: BarChart2,
      label: 'Stats',
      id: 'stats',
      href: '/stats',
      description: 'Your progress'
    },
    {
      icon: Settings,
      label: 'Settings',
      id: 'settings',
      href: '/settings',
      description: 'Preferences'
    }
  ];

  return (
    <nav className="flex flex-col items-center py-6 w-16 bg-[#0f172a] border-r border-[#1e293b]">
      <div className="flex flex-col items-center gap-2 w-full">
        {navItems.map((item) => {
          const isActive = currentView === item.id || pathname === item.href;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                group flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 w-full
                ${isActive
                  ? 'bg-[#6366f1]/10 text-[#6366f1]'
                  : 'text-[#64748b] hover:text-white hover:bg-[#1e293b]'
                }
              `}
            >
              <item.icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className={`transition-all duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Streak badge at bottom */}
      <button className="mt-6 p-3 rounded-xl text-[#f59e0b] hover:text-[#fbbf24] hover:bg-[#f59e0b]/10 transition-all duration-200 group relative">
        <Flame size={22} className="group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#f59e0b]"></span>
        </span>
      </button>
    </nav>
  );
}
