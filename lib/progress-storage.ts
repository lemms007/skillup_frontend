/**
 * Progress Storage - localStorage-based progress tracking for lessons
 * Provides a simple key-value store for lesson progress without backend requirements
 */

const STORAGE_KEY = 'skillup-lesson-progress';

/**
 * Get progress for a specific lesson
 */
export function getProgress(lessonId: string): number {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return 0;

    const progressMap = JSON.parse(data) as Record<string, number>;
    return progressMap[lessonId] || 0;
  } catch (error) {
    console.warn('Failed to get progress from localStorage:', error);
    return 0;
  }
}

/**
 * Update progress for a specific lesson
 */
export function updateProgress(lessonId: string, progress: number): void {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    let progressMap: Record<string, number> = {};

    if (data) {
      progressMap = JSON.parse(data);
    }

    progressMap[lessonId] = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
  } catch (error) {
    console.warn('Failed to save progress to localStorage:', error);
  }
}

/**
 * Mark a lesson as complete
 */
export function setComplete(lessonId: string): void {
  updateProgress(lessonId, 100);
}

/**
 * Reset progress for a lesson
 */
export function resetProgress(lessonId: string): void {
  const data = localStorage.getItem(STORAGE_KEY);
  let progressMap: Record<string, number> = {};

  if (data) {
    progressMap = JSON.parse(data);
  }

  delete progressMap[lessonId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
}

/**
 * Get all saved lesson IDs
 */
export function getAllLessonIds(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const progressMap = JSON.parse(data) as Record<string, number>;
    return Object.keys(progressMap);
  } catch (error) {
    console.warn('Failed to get lesson IDs from localStorage:', error);
    return [];
  }
}

/**
 * Clear all progress data
 */
export function clearAllProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
