import type { WP_Lesson, Lesson, Difficulty } from '@/types';

/**
 * Parse duration string "MM:SS" to minutes (number)
 * Example: "6:03" -> 6.05
 */
export function parseDurationToMinutes(duration: string): number {
  const parts = duration.split(':');
  if (parts.length === 2) {
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    return minutes + seconds / 60;
  }
  return 0;
}

/**
 * Transform WordPress GraphQL lesson data to internal Lesson format
 */
export function transformWP_LessonToLesson(wpLesson: WP_Lesson): Lesson {
  // Extract video ID from YouTube URL
  const videoId = extractYouTubeVideoId(wpLesson.lessonData.videoUrl);

  // Generate thumbnail from YouTube video ID if no custom thumbnail
  const thumbnailUrl = wpLesson.lessonData.thumbnail ||
                       `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  // Get first difficulty level, default to 'Beginner'
  const difficulty = wpLesson.difficulty?.[0] as Difficulty || 'Beginner';

  return {
    id: wpLesson.id,
    title: wpLesson.title,
    thumbnailUrl: thumbnailUrl,
    durationInMinutes: parseDurationToMinutes(wpLesson.lessonData.duration),
    difficulty: difficulty,
    instructor: {
      name: wpLesson.lessonData?.author || 'Unknown Instructor',
      avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(wpLesson.lessonData?.author || 'Instructor') + '&background=6366f1&color=fff',
    },
    course: {
      title: 'SkillUp Course',
    },
    tags: wpLesson.tags || [],
    progress: wpLesson.progress || 0,
    completed: wpLesson.completed || false,
    videoUrl: wpLesson.lessonData.videoUrl,
    description: wpLesson.lessonData.description,
  };
}

/**
 * Extract YouTube video ID from various URL formats
 * Examples:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 */
function extractYouTubeVideoId(videoUrl: string): string {
  const match = videoUrl.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (match) {
    return match[1];
  }
  // Try youtu.be format
  const match2 = videoUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (match2) {
    return match2[1];
  }
  // Fallback: use the whole URL
  return videoUrl;
}
