'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { ResumeHero } from '@/components/dashboard/ResumeHero';
import { LessonGrid } from '@/components/dashboard/LessonGrid';
import { NewForYou } from '@/components/dashboard/NewForYou';
import type { Lesson } from '@/types';
import { fetchLessons } from '@/lib/lessons-api';

export default function Home() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLoading(true);
        const fetchedLessons = await fetchLessons();
        setLessons(fetchedLessons);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch lessons'));
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSelectedLesson(null);
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    console.log('Playing lesson:', lesson.title);
  };

  const resumeLesson = selectedLesson || (lessons[0] || {} as Lesson);

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
        {loading ? (
          <div className="glass rounded-2xl p-12 text-center card-hover">
            <div className="animate-pulse">
              <div className="h-8 bg-[#1e293b] rounded w-1/3 mb-4 mx-auto"></div>
              <div className="h-4 bg-[#1e293b] rounded w-1/4 mx-auto"></div>
            </div>
          </div>
        ) : error ? (
          <div className="glass rounded-2xl p-6 text-center text-red-400 card-hover">
            <p>Error loading lessons. Please ensure WordPress GraphQL server is running.</p>
          </div>
        ) : (
          <>
            <ResumeHero
              lesson={resumeLesson}
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
                lessons={lessons.slice(1)}
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
              lessons={lessons}
              onLessonClick={handleLessonClick}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
