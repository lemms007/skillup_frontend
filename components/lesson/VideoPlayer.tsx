'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { Lesson, VideoPlayerProps } from '@/types';
import { updateLessonProgress, markLessonComplete } from '@/lib/lessons-api';

export function VideoPlayer({ lesson, onProgressUpdate, onComplete, isPlaying: initialPlaying = false }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(initialPlaying);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [iframeSrc, setIframeSrc] = useState('');
  const [error, setError] = useState<string | null>(null);

  const controlsTimeoutRef = useRef<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const VIDEO_ID = lesson.thumbnailUrl.match(/[?&]v=([a-zA-Z0-9_-]+)/)?.[1] || 'dQw4w9WgXcQ';
  const BASE_EMBED_URL = `https://www.youtube.com/embed/${VIDEO_ID}?rel=0&modestbranding=1&iv_load_policy=3&loop=1`;

  /**
   * Update iframe source with autoplay parameter
   */
  const updateIframeSrc = useCallback((autoplay: number) => {
    let newSrc = `${BASE_EMBED_URL}&autoplay=${autoplay}&playlist=${VIDEO_ID}`;
    return newSrc;
  }, [VIDEO_ID]);

  /**
   * Format duration string
   */
  const formatDuration = (minutes: number): string => {
    const m = Math.floor(minutes);
    const s = Math.floor((minutes - m) * 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  /**
   * Handle mouse move on player container
   */
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  /**
   * Handle mouse leave
   */
  const handleMouseLeave = useCallback(() => {
    if (isPlaying) setShowControls(false);
  }, [isPlaying]);

  /**
   * Handle play/pause toggle
   */
  const togglePlayPause = useCallback(async () => {
    if (!iframeRef.current) return;

    const currentSrc = iframeRef.current.src;
    const autoplay = isPlaying ? 0 : 1;
    let newSrc = currentSrc.replace(/&autoplay=\d+/g, `&autoplay=${autoplay}`);
    if (currentSrc === newSrc) {
      newSrc = currentSrc.replace(/autoplay=1/g, 'autoplay=0').replace(/autoplay=0/g, 'autoplay=1');
    }
    iframeRef.current.src = newSrc;
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  /**
   * Handle progress seek
   */
  const handleProgressSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!iframeRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));

    // Calculate new time by replacing start parameter
    const startTimeMatch = iframeRef.current.src.match(/&t=([0-9.]+)/);
    let startTime = startTimeMatch ? parseFloat(startTimeMatch[1]) : 0;
    const durationMatch = iframeRef.current.src.match(/&duration=([0-9]+)/);
    const duration = durationMatch ? parseFloat(durationMatch[1]) : 0;

    startTime += (percentage / 100) * duration;
    const newSrc = iframeRef.current.src.replace(/&t=[0-9.]+/g, `&t=${startTime}`);
    iframeRef.current.src = newSrc;
    setProgress(percentage * 100);
  }, []);

  /**
   * Handle volume change
   */
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!iframeRef.current) return;

    const volume = parseInt(e.target.value, 10);
    const newSrc = iframeRef.current.src.replace(/&volume=\d+$/g, `&volume=${volume}`).replace(/&volume=0&mute=1/g, '');
    iframeRef.current.src = newSrc;
    setIsMuted(volume === 0);
  }, []);

  /**
   * Handle toggle mute
   */
  const toggleMute = useCallback(async () => {
    if (!iframeRef.current) {
      updateIframeSrc(isPlaying ? 0 : 1);
      return;
    }

    const currentSrc = iframeRef.current.src;
    if (isMuted) {
      iframeRef.current.src = currentSrc.replace(/&mute=1/g, '').replace(/&volume=0$/g, '');
      setIsMuted(false);
    } else {
      iframeRef.current.src = currentSrc.replace(/&volume=\d+$/g, '&mute=1&volume=0');
      setIsMuted(true);
    }
  }, [isMuted, isPlaying, updateIframeSrc]);

  /**
   * Handle fullscreen toggle
   */
  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      if (playerContainerRef.current) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    } else {
      if (playerContainerRef.current) {
        await playerContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    }
  }, [isFullscreen]);

  /**
   * Handle progress update callback
   */
  const handleProgressUpdate = useCallback(async (newProgress: number) => {
    setProgress(newProgress);
    onProgressUpdate?.(newProgress);

    // Save progress to localStorage at regular intervals
    if (Math.round(newProgress) % 10 === 0) {
      await updateLessonProgress(lesson.id, newProgress);
    }
  }, [lesson.id, onProgressUpdate]);

  /**
   * Handle complete callback
   */
  const handleComplete = useCallback(async () => {
    onComplete?.();
    await markLessonComplete(lesson.id);
  }, [lesson.id, onComplete]);

  /**
   * Handle seek buttons
   */
  const handleSeek = useCallback((e: React.MouseEvent<HTMLButtonElement>, direction: -1 | 1) => {
    if (!iframeRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));

    const startTimeMatch = iframeRef.current.src.match(/&t=([0-9.]+)/);
    let startTime = startTimeMatch ? parseFloat(startTimeMatch[1]) : 0;
    const durationMatch = iframeRef.current.src.match(/&duration=([0-9]+)/);
    const duration = durationMatch ? parseFloat(durationMatch[1]) : 0;

    startTime += (percentage / 100) * duration;
    const newSrc = iframeRef.current.src.replace(/&t=[0-9.]+/g, `&t=${startTime}`);
    iframeRef.current.src = newSrc;
    setProgress(percentage * 100);
  }, []);

  // Initialize iframe on mount
  useEffect(() => {
    updateIframeSrc(1);
  }, [updateIframeSrc]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Recalculate progress when iframe src changes
  useEffect(() => {
    if (!iframeRef.current || !isPlaying) return;

    const timer = setTimeout(() => {
      const iframeElement = iframeRef.current;
      if (!iframeElement) return;

      const src = iframeElement.src;
      const tMatch = src.match(/&t=([0-9.]+)/);
      const durationMatch = src.match(/&duration=([0-9]+)/);
      if (tMatch && durationMatch) {
        const currentTime = parseFloat(tMatch[1]);
        const duration = parseFloat(durationMatch[1]);
        if (duration > 0) {
          const newProgress = (currentTime / duration) * 100;
          setProgress(newProgress);
          handleProgressUpdate(newProgress);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [iframeSrc, isPlaying, handleProgressUpdate]);

  // Update autoplay parameter when isPlaying changes
  useEffect(() => {
    updateIframeSrc(isPlaying ? 0 : 1);
  }, [isPlaying, updateIframeSrc]);

  const playerContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={playerContainerRef}
      className={`
        relative rounded-3xl overflow-hidden glass-strong
        ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}
      `}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video container - Cinema mode aspect ratio */}
      <div
        className={`
          relative bg-black transition-all duration-500
          ${isFullscreen ? 'w-full h-full' : 'aspect-video'}
        `}
      >
        {/* Iframe */}
        {iframeSrc ? (
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            title={lesson.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // Loading state
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse">
              <Play size={48} className="text-white/50" />
            </div>
          </div>
        )}

        {/* Progress bar - only show when controls visible or hovering */}
        {(showControls || isFullscreen) && (
          <div className="absolute top-0 left-0 right-0 px-6 py-4 z-20">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm cursor-pointer">
              <div
                className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full relative"
                style={{ width: `${progress}%` }}
                onClick={handleProgressSeek}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-[#6366f1]/50" />
              </div>
            </div>
          </div>
        )}

        {/* Play/Pause overlay when controls hidden */}
        {!showControls && isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse">
              <Play size={64} className="text-white/80 drop-shadow-2xl" />
            </div>
          </div>
        )}

        {/* Fullscreen exit hint */}
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-md text-white rounded-lg text-sm hover:bg-black/80 transition-colors"
          >
            Exit Cinema Mode
          </button>
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
          <div className="flex items-center gap-4 flex-1">
            {/* Play/Pause */}
            <button
              onClick={togglePlayPause}
              className="text-white hover:text-[#6366f1] transition-colors"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>

            {/* Progress time */}
            <div className="flex items-center gap-2 text-sm text-white/70">
              <span>{formatDuration(progress / 60)}</span>
              <span className="text-white/30">/</span>
              <span>{formatDuration(lesson.durationInMinutes)}</span>
            </div>

            {/* Seek buttons */}
            <button
              onClick={(e) => handleSeek(e, -1)}
              className="p-1 hover:text-[#6366f1] transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => handleSeek(e, 1)}
              className="p-1 hover:text-[#6366f1] transition-colors"
            >
              <ChevronRight size={20} />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-white/70 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : 50}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white/70 hover:text-white transition-colors"
            >
              <Maximize size={20} />
            </button>
          </div>

          {/* Completion indicator */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#10b981]/30 flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              Mark Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
