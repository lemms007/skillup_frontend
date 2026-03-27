// Type definitions for SkillSync - Headless WordPress Micro-Learning Platform

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
  progress?: number; // 0-100
  completed?: boolean;
  tags: string[];
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
