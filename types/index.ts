// Type definitions for SkillSync - Headless WordPress Micro-Learning Platform

// WordPress GraphQL Response Types
// Based on actual WPGraphQL schema for Lesson CPT
export interface WP_Lesson {
  id: string;
  title: string;
  lessonData: {
    videoUrl: string;
    thumbnail: string;
    description: string;
    duration: string; // Format: "MM:SS" (e.g., "6:03")
    difficulty: string;
    instructor: string; // Instructor is a String field in WPGraphQL
  };
}

// Internal Application Type
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Lesson {
  id: string;
  title: string;
  thumbnailUrl: string;
  durationInMinutes: number;
  difficulty: Difficulty;
  instructor: {
    name: string;
    avatar: string;
  };
  course: {
    title: string;
  };
  progress: number; // 0-100 (now required)
  completed: boolean; // now required
  tags: string[];
  videoUrl: string;
  description?: string; // Lesson description from WordPress lessonData
}

export interface LessonCardProps {
  lesson: Lesson;
  onClick: (lesson: Lesson) => void;
  onProgressUpdate?: (lessonId: string, progress: number) => void;
}

export interface VideoPlayerProps {
  lesson: Lesson;
  onProgressUpdate: (progress: number) => void;
  onComplete: () => void;
  isPlaying?: boolean;
}

export interface StreakWidgetProps {
  streakCount: number;
  dailyGoal: number;
  isCurrentStreak?: boolean;
}

export interface WeeklyMinutesProps {
  data: {
    day: string;
    minutes: number;
  }[];
}

export interface ResumeHeroProps {
  lesson: Lesson | null;
  onPlay: (lesson: Lesson) => void;
}

export interface NavigationRailProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export interface RightSidebarProps {
  streakCount: number;
  dailyGoal: number;
  weeklyMinutesData: {
    day: string;
    minutes: number;
  }[];
}
