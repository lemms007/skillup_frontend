import { GraphQLClient, RequestDocument } from 'graphql-request';
import { client as wordpressClient } from './graphql-client';
import { transformWP_LessonToLesson } from './lesson-transformer';
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
      author: null,
      duration: '8:30',
      difficulty: 'Advanced',
      instructor: 'The Net Ninja',
      instructorAvatar: 'https://ui-avatars.com/api/?name=The+Net+Ninja&background=6366f1&color=fff'
    },
    tags: ['Animation', 'Framer Motion'],
    progress: 0,
    completed: false,
    course: { title: 'Frontend Animation' }
  },
  {
    id: '2',
    title: 'React Hooks Deep Dive',
    lessonData: {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      description: 'Master useState, useEffect, and custom hooks.',
      author: 'Jane Doe',
      duration: '15:20',
      difficulty: 'Intermediate',
      instructor: 'Jane Doe',
      instructorAvatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=10b981&color=fff'
    },
    tags: ['React', 'Hooks'],
    progress: 45,
    completed: false,
    course: { title: 'React Fundamentals' }
  },
  {
    id: '3',
    title: 'CSS Grid Layouts',
    lessonData: {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      description: 'Build complex layouts with CSS Grid.',
      author: 'John Smith',
      duration: '12:45',
      difficulty: 'Intermediate',
      instructor: 'John Smith',
      instructorAvatar: 'https://ui-avatars.com/api/?name=John+Smith&background=3b82f6&color=fff'
    },
    tags: ['CSS', 'Grid'],
    progress: 0,
    completed: false,
    course: { title: 'Modern CSS' }
  },
  {
    id: '4',
    title: 'TypeScript Generics',
    lessonData: {
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      description: 'Advanced TypeScript patterns and best practices.',
      author: 'Alice Johnson',
      duration: '20:10',
      difficulty: 'Advanced',
      instructor: 'Alice Johnson',
      instructorAvatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=f59e0b&color=fff'
    },
    tags: ['TypeScript', 'Advanced'],
    progress: 0,
    completed: false,
    course: { title: 'TypeScript Mastery' }
  }
];

/**
 * Fetch all lessons from WordPress GraphQL
 * Falls back to mock data for local development
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
            author
            duration
            difficulty
            instructor
            instructorAvatar
          }
          tags
          progress
          completed
          course {
            title
          }
        }
      }
    }
  `;

  try {
    // Try fetching from WordPress GraphQL
    const result = await wordpressClient.request<{ lessons: { nodes: WP_Lesson[] } }>(query);
    const wpLessons = result.lessons?.nodes || [];
    return wpLessons.map(transformWP_LessonToLesson);
  } catch (err) {
    // If WordPress server is unavailable, use mock data for development
    console.warn('WordPress GraphQL unavailable, using mock data:', err);
    return mockLessonsData.map(transformWP_LessonToLesson);
  }
}
