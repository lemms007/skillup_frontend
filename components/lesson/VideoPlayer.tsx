'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Lesson, VideoPlayerProps } from '@/types';

export function VideoPlayer({ lesson, onProgressUpdate, onComplete, isPlaying = false }: VideoPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  const formatDuration = (minutes: number) => {
    const m = Math.floor(minutes);
    const s = Math.floor((minutes - m) * 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <div
      className={`
        relative rounded-3xl overflow-hidden glass-strong
        ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}
      `}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video container - Cinema mode aspect ratio */}
      <div className={`
        relative bg-black transition-all duration-500
        ${isFullscreen ? 'w-full h-full' : 'aspect-video'}
      `}>
        {/* Video thumbnail/poster */}
        <img
          src={lesson.thumbnailUrl}
          alt={lesson.title}
          className="w-full h-full object-cover opacity-60"
        />

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 px-6 py-4 z-20">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm cursor-pointer">
            <div
              className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-[#6366f1]/50" />
            </div>
          </div>
        </div>

        {/* Play/Pause overlay when controls hidden */}
        {!showControls && isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse">
              <Play size={64} className="text-white/80 drop-shadow-2xl" />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 px-6 py-4 glass bg-gradient-to-t from-black/80 to-transparent
          transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        {/* Title */}
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-white font-semibold text-lg line-clamp-2">{lesson.title}</h2>
          <span className="px-2 py-0.5 bg-[#6366f1]/30 rounded text-xs text-[#8b5cf6]">
            {lesson.difficulty}
          </span>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:text-[#6366f1] transition-colors"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>

            {/* Progress time */}
            <div className="flex items-center gap-2 text-sm text-white/70">
              <span>{formatDuration(progress)}</span>
              <span className="text-white/30">/</span>
              <span>{formatDuration(lesson.durationInMinutes)}</span>
            </div>

            {/* Volume */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-white/70 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <Maximize size={20} />
            </button>
          </div>

          {/* Completion indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#10b981]/30"
            >
              Mark Complete
            </button>
          </div>
        </div>
      </div>

      {/* Cinema mode exit hint */}
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-md text-white rounded-lg text-sm hover:bg-black/80 transition-colors"
        >
          Exit Cinema Mode
        </button>
      )}
    </div>
  );
}
