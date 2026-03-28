'use client';

import { Sparkles } from 'lucide-react';
import type { Lesson } from '@/types';
import { LessonCard } from '@/components/lesson/LessonCard';

interface NewForYouProps {
  lessons: Lesson[];
  onLessonClick: (lesson: Lesson) => void;
}

export function NewForYou({ lessons, onLessonClick }: NewForYouProps) {
  // Select first 4 lessons for "New for You" (deterministic for stability)
  const featuredLessons = lessons.slice(0, 4);

  if (featuredLessons.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-[#6366f1]" />
        <h2 className="text-xl font-bold text-white">New for You</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredLessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onClick={onLessonClick}
          />
        ))}
      </div>
    </section>
  );
}
