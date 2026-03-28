import { GraphQLClient, RequestDocument } from 'graphql-request';
import { client as wordpressClient } from './graphql-client';
import { transformWP_LessonToLesson } from './lesson-transformer';
import { getProgress, updateProgress, setComplete } from './progress-storage';
import type { WP_Lesson, Lesson } from '@/types';

/**
 * Mock data for local development (when WordPress server is unavailable)
 */
const mockLessonsData: WP_Lesson[] = [
  {
    id: '1',
    title: 'Framer Motion Hovers',
    lessonData: {
      videoUrl: 'https://www.youtube.com/watch?v=znbXatZpZpY',
      thumbnail: 'https://img.youtube.com/vi/znbXatZpZpY/maxresdefault.jpg',
      description: 'Adding professional micro-animations to your lesson cards.',
      duration: '8:30',
      difficulty: 'Advanced',
      instructor: 'The Net Ninja'
    }
  },
  {
    id: '2',
    title: 'React Hooks Deep Dive',
    lessonData: {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      description: 'Master useState, useEffect, and custom hooks.',
      duration: '15:20',
      difficulty: 'Intermediate',
      instructor: 'Jane Doe'
    }
  },
  {
    id: '3',
    title: 'CSS Grid Layouts',
    lessonData: {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      description: 'Build complex layouts with CSS Grid.',
      duration: '12:45',
      difficulty: 'Intermediate',
      instructor: 'John Smith'
    }
  },
  {
    id: '4',
    title: 'TypeScript Generics',
    lessonData: {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      description: 'Advanced TypeScript patterns and best practices.',
      duration: '20:10',
      difficulty: 'Advanced',
      instructor: 'Alice Johnson'
    }
  }
];

/**
 * Fetch all lessons from WordPress GraphQL
 * Falls back to mock data for local development
 * Integrates with localStorage for progress persistence
 */
export async function fetchLessons(): Promise<Lesson[]> {
  const query: RequestDocument = `
    query GetLessons {
      lessons {
        nodes {
          id
          title
          lessonData {
            videoUrl
            thumbnail
            description
            duration
            difficulty
            instructor
          }
        }
      }
    }
  `;

  try {
    // Try fetching from WordPress GraphQL
    const result = await wordpressClient.request<{ lessons: { nodes: WP_Lesson[] } }>(query);
    const wpLessons = result.lessons?.nodes || [];

    // Transform WordPress data to internal format
    const transformedLessons = wpLessons.map(transformWP_LessonToLesson);

    // Merge with localStorage progress
    const lessonsWithProgress = transformedLessons.map((lesson) => {
      // Get progress from localStorage
      const savedProgress = getProgress(lesson.id);
      const progress = savedProgress || 0;
      const completed = progress === 100;

      return {
        ...lesson,
        progress,
        completed
      };
    });

    // Save progress to localStorage
    lessonsWithProgress.forEach((lesson) => {
      if (lesson.progress !== 100) {
        updateProgress(lesson.id, lesson.progress);
      }
    });

    return lessonsWithProgress;
  } catch (err) {
    // If WordPress server is unavailable, use mock data for development
    console.warn('WordPress GraphQL unavailable, using mock data:', err);
    return mockLessonsData.map(transformWP_LessonToLesson);
  }
}

/**
 * Update lesson progress
 */
export async function updateLessonProgress(lessonId: string, progress: number): Promise<void> {
  // Save to localStorage
  updateProgress(lessonId, progress);

  // Update WordPress if available
  try {
    const updateQuery: RequestDocument = `
      mutation UpdateLessonProgress($id: ID!, $progress: Float!, $completed: Boolean!) {
        lessonUpdate(id: $id) {
          id
          progress
          completed
        }
      }
    `;

    const result = await wordpressClient.request<{
      lessonUpdate: { id: string; progress: number; completed: boolean }
    }>(updateQuery, { id: lessonId, progress, completed: progress === 100 });

    console.log('Updated lesson progress:', result.lessonUpdate);
  } catch (err) {
    console.warn('Failed to update WordPress progress:', err);
    // Continue anyway - localStorage update already succeeded
  }
}

/**
 * Mark lesson as complete
 */
export async function markLessonComplete(lessonId: string): Promise<void> {
  await updateLessonProgress(lessonId, 100);
}
