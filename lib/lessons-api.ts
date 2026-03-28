import { GraphQLClient } from 'graphql-request';
import { client } from './graphql-client';
import { transformWP_LessonToLesson } from './lesson-transformer';
import type { WP_Lesson, Lesson } from '@/types';

/**
 * Fetch all lessons from WordPress GraphQL
 */
export async function fetchLessons(): Promise<Lesson[]> {
  const query = `
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

  const result = await client.request<{ lessons: { nodes: WP_Lesson[] } }>(query);
  const wpLessons = result.lessons?.nodes || [];

  // Transform WordPress data to internal Lesson format
  return wpLessons.map(transformWP_LessonToLesson);
}
