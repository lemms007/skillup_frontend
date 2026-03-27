'use client';

import { useState } from 'react';
import { Play, ChevronRight } from 'lucide-react';
import type { Lesson } from '@/types';

interface ResumeHeroProps {
  lesson: Lesson | null;
  onPlay: (lesson: Lesson) => void;
}

export function ResumeHero({ lesson, onPlay }: ResumeHeroProps) {
  if (!lesson) {
    return (
      <div className="glass rounded-2xl p-8 text-center border-dashed border-2 border-[#334155]">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1e293b] flex items-center justify-center">
          <Play size={32} className="text-[#64748b]" />
        </div>
        <h3 className="text-lg font-semibold text-[#f8fafc] mb-2">No recent lessons</h3>
        <p className="text-[#64748b]">Start your learning journey today!</p>
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    const m = Math.floor(minutes);
    const s = Math.floor((minutes - m) * 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8 card-hover relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366f1]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366f1]/20 text-[#8b5cf6] text-sm font-medium mb-3">
              <Play size={14} fill="currentColor" />
              Resume Learning
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {lesson.title}
            </h2>
            <p className="text-[#94a3b8]">{lesson.course.title}</p>
          </div>

          {/* Progress info */}
          {lesson.progress !== undefined && (
            <div className="text-right">
              <div className="text-3xl font-bold text-[#6366f1] mb-1">
                {Math.round(lesson.progress)}%
              </div>
              <p className="text-sm text-[#94a3b8]">Completed</p>
            </div>
          )}
        </div>

        {/* Thumbnail and action */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-64 aspect-video rounded-xl overflow-hidden bg-[#1e293b]">
            <img
              src={lesson.thumbnailUrl}
              alt={lesson.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Play size={32} className="text-white drop-shadow-lg" />
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <img
                  src={lesson.instructor.avatar}
                  alt={lesson.instructor.name}
                  className="w-8 h-8 rounded-full border border-[#334155]"
                />
                <span className="text-sm text-[#94a3b8]">{lesson.instructor.name}</span>
              </div>
              <span className="text-sm text-[#94a3b8]">
                {formatDuration(lesson.durationInMinutes)}
              </span>
            </div>

            {/* Progress bar */}
            {lesson.progress !== undefined && lesson.progress > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-[#94a3b8] mb-1.5">
                  <span>Progress</span>
                  <span>{Math.round(lesson.progress)}%</span>
                </div>
                <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full transition-all duration-500"
                    style={{ width: `${lesson.progress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => onPlay(lesson)}
              className="w-full py-3.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#6366f1]/30"
            >
              <Play size={18} fill="currentColor" />
              {lesson.progress === 100 ? 'Continue' : 'Start Lesson'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
