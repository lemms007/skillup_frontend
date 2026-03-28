'use client';

import { useState } from 'react';
import { Filter, Search, Clock } from 'lucide-react';
import type { Lesson } from '@/types';
import { LessonCard } from '@/components/lesson/LessonCard';

interface LessonGridProps {
  lessons: Lesson[];
  onLessonClick: (lesson: Lesson) => void;
}

export function LessonGrid({ lessons, onLessonClick }: LessonGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredLessons = lessons
    .filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            lesson.course.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty;
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      // Sort by progress (highest first) for "Continue Learning" focus
      const progressA = a.progress ?? 0;
      const progressB = b.progress ?? 0;
      return progressB - progressA;
    });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]" size={20} />
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1e293b] border border-[#334155] text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-all"
          />
        </div>

        {/* Filter */}
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]" size={20} />
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="pl-12 pr-8 py-3 rounded-xl bg-[#1e293b] border border-[#334155] text-[#f8fafc] appearance-none focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-all cursor-pointer"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff === 'all' ? 'All Levels' : diff}
              </option>
            ))}
          </select>
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]" size={16} />
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-[#64748b]">
        Showing {filteredLessons.length} lesson{filteredLessons.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      {filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onClick={onLessonClick}
            />
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1e293b] flex items-center justify-center">
            <Filter size={32} className="text-[#64748b]" />
          </div>
          <h3 className="text-lg font-semibold text-[#f8fafc] mb-2">No lessons found</h3>
          <p className="text-[#64748b]">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
