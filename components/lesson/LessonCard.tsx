'use client';

import { Play, Clock } from 'lucide-react';
import type { Lesson, LessonCardProps } from '@/types';

export function LessonCard({ lesson, onClick }: LessonCardProps) {
  const formatDuration = (minutes: number) => {
    if (minutes < 1) return '0:00';
    const m = Math.floor(minutes);
    const s = Math.floor((minutes - m) * 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const difficultyStyles = {
    Beginner: 'badge-beginner',
    Intermediate: 'bg-[#3b82f6] text-white',
    Advanced: 'badge-advanced'
  };

  return (
    <button
      onClick={() => onClick(lesson)}
      className="group relative rounded-2xl overflow-hidden glass card-hover w-full text-left"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-[#1e293b] overflow-hidden">
        <img
          src={lesson.thumbnailUrl}
          alt={lesson.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#6366f1] rounded-full blur-xl opacity-50 animate-pulse" />
            <Play
              size={48}
              className="relative text-white drop-shadow-lg transform group-hover:scale-110 transition-transform"
            />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute top-3 right-3 bg-[#1e293b]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#334155] flex items-center gap-1">
          <Clock size={14} className="text-[#94a3b8]" />
          <span className="text-xs font-medium text-[#f8fafc]">
            {formatDuration(lesson.durationInMinutes)}
          </span>
        </div>

        {/* Difficulty badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`
              px-2.5 py-1 rounded-lg text-xs font-medium border
              ${difficultyStyles[lesson.difficulty as keyof typeof difficultyStyles]}
              ${lesson.difficulty === 'Advanced' ? 'border-[#d97706]' : 'border-[#059669]'}
            `}
          >
            {lesson.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[#f8fafc] mb-1 line-clamp-2 group-hover:text-[#6366f1] transition-colors">
          {lesson.title}
        </h3>
        <p className="text-sm text-[#94a3b8]">{lesson.course.title}</p>
        {lesson.description && (
          <p className="text-sm text-[#64748b] line-clamp-2 mt-2">
            {lesson.description}
          </p>
        )}

        {/* Instructor */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1e293b]">
          <img
            src={lesson.instructor.avatar}
            alt={lesson.instructor.name}
            className="w-6 h-6 rounded-full border border-[#334155]"
          />
          <span className="text-xs text-[#64748b]">{lesson.instructor.name}</span>
        </div>
      </div>

      {/* Progress indicator if exists */}
      {lesson.progress !== undefined && lesson.progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1e293b]">
          <div
            className="h-full bg-[#6366f1] transition-all duration-300"
            style={{ width: `${lesson.progress}%` }}
          />
        </div>
      )}
    </button>
  );
}
