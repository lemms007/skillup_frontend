'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { ResumeHero } from '@/components/dashboard/ResumeHero';
import { LessonGrid } from '@/components/dashboard/LessonGrid';
import { NewForYou } from '@/components/dashboard/NewForYou';
import type { Lesson } from '@/types';

// Mock data - In production, this would come from WordPress GraphQL
const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to React Hooks',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationInMinutes: 8,
    difficulty: 'Beginner',
    instructor: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    course: {
      title: 'Frontend Development Fundamentals'
    },
    progress: 45,
    completed: false,
    tags: ['React', 'Hooks', 'JavaScript'],
    description: 'Learn the fundamentals of React Hooks including useState and useEffect to manage state and side effects in functional components.'
  },
  {
    id: '2',
    title: 'Advanced CSS Grid Layouts',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationInMinutes: 12,
    difficulty: 'Advanced',
    instructor: {
      name: 'Michael Torres',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
    },
    course: {
      title: 'Modern CSS Mastery'
    },
    progress: 0,
    completed: false,
    tags: ['CSS', 'Grid', 'Layout'],
    description: 'Master CSS Grid layout with advanced techniques for building complex web layouts and responsive designs.'
  },
  {
    id: '3',
    title: 'TypeScript Generics Deep Dive',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515688514762-505035253233?w=600',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationInMinutes: 15,
    difficulty: 'Advanced',
    instructor: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    course: {
      title: 'TypeScript Mastery'
    },
    progress: 0,
    completed: false,
    tags: ['TypeScript', 'Generics', 'Advanced'],
    description: 'Deep dive into TypeScript generics to create reusable, type-safe components and functions.'
  },
  {
    id: '4',
    title: 'Building REST APIs with Node.js',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationInMinutes: 20,
    difficulty: 'Intermediate',
    instructor: {
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    },
    course: {
      title: 'Backend Development Bootcamp'
    },
    progress: 0,
    completed: false,
    tags: ['Node.js', 'API', 'Backend'],
    description: 'Learn how to build scalable REST APIs using Node.js, Express, and best practices for API design.'
  },
  {
    id: '5',
    title: 'Responsive Design Principles',
    thumbnailUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationInMinutes: 10,
    difficulty: 'Beginner',
    instructor: {
      name: 'Maria Garcia',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100'
    },
    course: {
      title: 'Frontend Development Fundamentals'
    },
    progress: 0,
    completed: false,
    tags: ['Responsive', 'Mobile', 'Design'],
    description: 'Master responsive web design principles to create websites that look great on all devices.'
  },
  {
    id: '6',
    title: 'Performance Optimization Techniques',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationInMinutes: 18,
    difficulty: 'Advanced',
    instructor: {
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    },
    course: {
      title: 'Web Performance Engineering'
    },
    progress: 0,
    completed: false,
    tags: ['Performance', 'Optimization', 'Core Web Vitals'],
    description: 'Learn advanced performance optimization techniques including Core Web Vitals, lazy loading, and code splitting.'
  },
  {
    id: '7',
    title: 'CSS Animations and Transitions',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationInMinutes: 14,
    difficulty: 'Intermediate',
    instructor: {
      name: 'Maria Garcia',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100'
    },
    course: {
      title: 'Modern CSS Mastery'
    },
    progress: 0,
    completed: false,
    tags: ['CSS', 'Animation', 'UI'],
    description: 'Create engaging user experiences with CSS animations and transitions for modern web interfaces.'
  },
  {
    id: '8',
    title: 'Getting Started with Git',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621504450168-388671981d10?w=600',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationInMinutes: 6,
    difficulty: 'Beginner',
    instructor: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    course: {
      title: 'Developer Fundamentals'
    },
    progress: 0,
    completed: false,
    tags: ['Git', 'Version Control', 'Basics'],
    description: 'Learn the fundamentals of Git version control for tracking changes and collaborating on code.'
  },
  {
    id: '9',
    title: 'Advanced State Management with Redux',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationInMinutes: 25,
    difficulty: 'Advanced',
    instructor: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    course: {
      title: 'React Advanced Patterns'
    },
    progress: 0,
    completed: false,
    tags: ['React', 'Redux', 'State'],
    description: 'Master advanced state management patterns with Redux for complex React applications.'
  }
];

export default function Home() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSelectedLesson(null);
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    console.log('Playing lesson:', lesson.title);
  };

  return (
    <DashboardLayout
      currentView={currentView}
      onNavigate={handleNavigate}
      streakCount={12}
      dailyGoal={30}
      weeklyMinutesData={[
        { day: 'Mon', minutes: 25 },
        { day: 'Tue', minutes: 18 },
        { day: 'Wed', minutes: 30 },
        { day: 'Thu', minutes: 22 },
        { day: 'Fri', minutes: 15 },
        { day: 'Sat', minutes: 45 },
        { day: 'Sun', minutes: 0 }
      ]}
    >
      <div className="space-y-6">
        <ResumeHero
          lesson={selectedLesson || mockLessons[0]}
          onPlay={handleLessonClick}
        />

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Continue Learning</h2>
            <button className="text-sm text-[#6366f1] hover:text-[#8b5cf6] transition-colors">
              View all
            </button>
          </div>
          <LessonGrid
            lessons={mockLessons.slice(1)}
            onLessonClick={handleLessonClick}
          />
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Featured Course</h2>
          <div className="glass rounded-2xl p-6 card-hover">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="relative w-full sm:w-64 aspect-video rounded-xl overflow-hidden bg-[#1e293b]">
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600"
                  alt="Backend Development Bootcamp"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-white mb-2">
                  Backend Development Bootcamp
                </h3>
                <p className="text-[#94a3b8] mb-4">
                  Master server-side development with Node.js, Express, and databases
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 bg-[#10b981] text-white rounded-lg text-sm font-medium">
                    12 Lessons
                  </span>
                  <span className="px-3 py-1 bg-[#3b82f6] text-white rounded-lg text-sm font-medium">
                    8 Hours
                  </span>
                  <span className="px-3 py-1 bg-[#6366f1] text-white rounded-lg text-sm font-medium">
                    Beginner
                  </span>
                </div>
              </div>
              <div className="flex sm:flex-col gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-6 py-3 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#6366f1]/30">
                  Enroll Now
                </button>
                <button className="flex-1 sm:flex-none px-6 py-3 glass hover:bg-[#1e293b] text-white rounded-xl font-medium transition-all duration-200">
                  Preview
                </button>
              </div>
            </div>
          </div>
        </section>

        <NewForYou
          lessons={mockLessons}
          onLessonClick={handleLessonClick}
        />
      </div>
    </DashboardLayout>
  );
}
