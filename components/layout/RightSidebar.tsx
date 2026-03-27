'use client';

import { Flame, Clock, Trophy } from 'lucide-react';

interface WeeklyData {
  day: string;
  minutes: number;
}

interface RightSidebarProps {
  streakCount: number;
  dailyGoal: number;
  weeklyMinutesData: WeeklyData[];
}

export function RightSidebar({ streakCount, dailyGoal, weeklyMinutesData }: RightSidebarProps) {
  const progress = Math.min((streakCount / dailyGoal) * 100, 100);

  // Calculate max minutes for scaling
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

        {/* Progress bar */}
        <div className="relative h-3 bg-[#1e293b] rounded-full overflow-hidden mb-2">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#f59e0b] to-[#fb923c] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-[#94a3b8]">
          {streakCount} of {dailyGoal} minutes today
        </p>

        {streakCount >= dailyGoal && (
          <div className="mt-3 flex items-center gap-1 text-xs text-[#10b981]">
            <Trophy size={14} />
            <span>Goal reached! 🎉</span>
          </div>
        )}
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
            const isToday = day.day === 'Today';

            return (
              <div key={day.day} className="flex flex-col items-center gap-2 flex-1">
                <div className="relative w-full flex items-end justify-center h-full">
                  <div
                    className={`
                      w-full max-w-[24px] rounded-t-lg transition-all duration-300
                      ${isToday
                        ? 'bg-gradient-to-t from-[#6366f1] to-[#8b5cf6]'
                        : 'bg-[#334155] hover:bg-[#475569]'
                      }
                    `}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className={`text-xs ${isToday ? 'text-[#6366f1] font-medium' : 'text-[#64748b]'}`}>
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-5 card-hover">
        <h3 className="font-semibold text-[#f8fafc] mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full p-3 rounded-xl bg-[#1e293b] hover:bg-[#334155] border border-[#334155] hover:border-[#6366f1] transition-all duration-200 text-left text-sm text-[#f8fafc]">
            🔔 Daily reminder
          </button>
          <button className="w-full p-3 rounded-xl bg-[#1e293b] hover:bg-[#334155] border border-[#334155] hover:border-[#6366f1] transition-all duration-200 text-left text-sm text-[#f8fafc]">
            📊 View detailed stats
          </button>
          <button className="w-full p-3 rounded-xl bg-[#1e293b] hover:bg-[#334155] border border-[#334155] hover:border-[#6366f1] transition-all duration-200 text-left text-sm text-[#f8fafc]">
            ⚙️ Adjust goals
          </button>
        </div>
      </div>
    </aside>
  );
}
