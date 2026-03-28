# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16.2.1 frontend for a learning application (SkillUp). The app connects to a WordPress GraphQL server for backend data. It uses TypeScript, Tailwind CSS v4, and is deployed on Vercel.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Application                     │
│                    (Next.js 16, TypeScript, Tailwind 4)      │
├─────────────────────────────────────────────────────────────┤
│  app/                                                       │
│    ├── layout.tsx     - Root layout with Geist fonts        │
│    ├── page.tsx       - Homepage                            │
│    ├── globals.css    - Global styles                       │
│    └── favicon.ico    - Application icon                    │
├─────────────────────────────────────────────────────────────┤
│  public/                                                    │
│    └── SVG assets                                            │
├─────────────────────────────────────────────────────────────┤
│  Config Files                                               │
│    ├── next.config.ts  - Next.js configuration              │
│    ├── tsconfig.json   - TypeScript configuration           │
│    ├── eslint.config.mjs - ESLint with Next.js presets      │
│    └── postcss.config.mjs - Tailwind CSS v4 postcss plugin │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  WordPress GraphQL Server                    │
│                      (Backend API)                           │
└─────────────────────────────────────────────────────────────┘
```

## Environment Setup

The project uses a `.env` file for environment variables. Common variables:

- `NEXT_PUBLIC_API_URL` - WordPress GraphQL endpoint
- WordPress GraphQL credentials/tokens

## Common Development Tasks

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Starting Production Server

```bash
npm run start
```

### Running Linter

```bash
npm run lint
```

## Key Technologies

- **Next.js 16.2.1** - App Router with Server Components (default)
- **React 19.2.4** - Latest React with concurrent features
- **TypeScript 5** - Full type safety
- **Tailwind CSS v4** - Utility-first CSS with PostCSS
- **WordPress GraphQL** - Backend data source

## Important Patterns

### Server Components (Default)

Next.js 16 defaults to Server Components. Use `'use client'` directive only when you need:
- Client-side interactivity (useState, useEffect, etc.)
- Browser APIs (window, document)
- Client-side event handlers

### Styling

- Tailwind CSS v4 with `@tailwindcss/postcss` plugin
- Dark mode support via `dark:` classes
- Geist Sans and Geist Mono fonts from Next.js

### WordPress Integration

The app consumes data from a WordPress GraphQL server.

### GraphQL Response Structure

The lessons endpoint returns data in this format:

```graphql
query GetLessons {
  lessons {
    nodes {
      title
      lessonData {
        videoUrl
        thumbnail
        description
        author
        duration
        difficulty
        instructor {
          name
        }
        instructorAvatar
      }
    }
  }
}
```

```json
{
  "data": {
    "lessons": {
      "nodes": [
        {
          "id": "string",
          "title": "Lesson Title",
          "lessonData": {
            "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
            "thumbnail": "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg",
            "description": "Lesson description text",
            "author": "Instructor Name",
            "duration": "8:30",
            "difficulty": "Intermediate",
            "instructor": { "name": "string" },
            "instructorAvatar": "string"
          },
          "tags": ["string"],
          "progress": 0-100,
          "completed": true/false,
          "course": { "title": "string" }
        }
      ]
    }
  }
}
```

### Data Transformation

The `lib/lesson-transformer.ts` transforms WordPress GraphQL data (`WP_Lesson`) to internal format (`Lesson`):
- Parses duration string "MM:SS" to minutes (number)
- Extracts YouTube video ID for thumbnails
- Maps difficulty levels (Beginner/Intermediate/Advanced)
- Uses instructor from `lessonData.instructor.name` or falls back to `lessonData.author`
- Uses instructorAvatar from `lessonData.instructorAvatar` or generates avatar from name
- Maps course from `course` field (defaults to 'SkillUp Course' if not provided)

See `types/index.ts` for full type definitions.

## Project-Specific Notes

- **Current State**: Starter template - the app has basic Next.js scaffolding with placeholder content
- **Font Configuration**: Uses Geist fonts configured in `app/layout.tsx`
- **ESLint**: Configured with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` for performance and type safety

## Design System

### Visual Style

**Theme**: Dark Mode by default (Deep Slate #0f172a background)
**Accent Colors**:
- Electric Indigo (#6366f1) - Primary interactions, buttons, progress
- Mint Green (#10b981) - Success states, completion, beginner difficulty
- Amber (#f59e0b) - Warnings, streak badges, advanced difficulty

**Glassmorphism Pattern**: All cards use semi-transparent backgrounds with backdrop blur
- Background: `rgba(255, 255, 255, 0.03)`
- Border: `1px solid rgba(255, 255, 255, 0.1)`
- Backdrop blur: `12px`

**Border Radius**: Large rounded corners (`rounded-2xl` = 16px) for cards and containers

### Color Palette (CSS Variables)

Defined in `app/globals.css`:

| Variable | Value | Use Case |
|----------|-------|----------|
| `--background` | #0f172a | Main background |
| `--foreground` | #f8fafc | Primary text |
| `--color-primary` | #6366f1 | Indigo buttons, links |
| `--color-primary-hover` | #4f46e5 | Hover states |
| `--color-success` | #10b981 | Success, completion |
| `--color-surface` | rgba(255,255,255,0.05) | Card backgrounds |
| `--glass-background` | rgba(255,255,255,0.03) | Glassmorphism |
| `--glass-border` | rgba(255,255,255,0.1) | Glass borders |

### Typography

- **Font Family**: Geist Sans (headings, body), Geist Mono (code, data)
- **Sizes**: Text-xs (10px), Text-sm (14px), Text-base (16px), Text-lg (18px), Text-xl (20px), Text-2xl (24px), Text-3xl (30px)
- **Weights**: 500 (medium) for headings, 400 (normal) for body, 600 (semibold) for badges

### Component Patterns

#### Buttons
```typescript
// Import from components/ui/Button
<Button variant="primary">Save Changes</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Back</Button>
<Button variant="success">Complete Lesson</Button>
```

#### Glass Cards
```typescript
// Standard glass card pattern
<div className="glass rounded-2xl p-6 card-hover">
  {/* Card content */}
</div>
```

#### Navigation Rail (Left Sidebar)
```typescript
// Import from components/layout/DashboardLayout
<DashboardLayout currentView="home" onNavigate={handleNavigate}>
  {/* Main content */}
</DashboardLayout>
```

#### Lesson Card
```typescript
// Import from components/lesson/LessonCard
<LessonCard
  lesson={lesson}
  onClick={handleLessonClick}
/>
```

### Animations

**Flame Glow** (Streak widget): 2s infinite alternate animation on box-shadow
**Progress Pulse**: 1.5s infinite opacity pulse for loading states
**Streak Pulse**: 2s infinite opacity pulse for active streak badges
**Card Hover**: 200ms translateY(-4px) lift on hover
**Transition**: `cubic-bezier(0.4, 0, 0.2, 1)` for smooth easing

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Left Rail (64px) │ Main Content (flex-1) │ Right Sidebar (320px)       │
│  - Navigation    │  - Header (64px)    │  - Streak Widget              │
│  - Home/Courses  │  - Page Content     │  - Weekly Minutes Chart       │
│  - Stats/etc.    │  - Scrollable       │                               │
│  - Desktop only  │  - p-6, overflow-auto│                              │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Inventory

| Component | Path | Description |
|-----------|------|-------------|
| Button | `components/ui/Button.tsx` | Primary, secondary, ghost, success variants |
| Input | `components/ui/Input.tsx` | Styled input with label and error |
| DashboardLayout | `components/layout/DashboardLayout.tsx` | Main layout wrapper |
| NavigationRail | `components/layout/NavigationRail.tsx` | Left navigation |
| RightSidebar | `components/layout/RightSidebar.tsx` | Streak + weekly chart |
| LessonCard | `components/lesson/LessonCard.tsx` | 16:9 lesson thumbnail card |
| VideoPlayer | `components/lesson/VideoPlayer.tsx` | Cinema mode player |
| ResumeHero | `components/dashboard/ResumeHero.tsx` | Resume learning hero |
| LessonGrid | `components/dashboard/LessonGrid.tsx` | Searchable lesson grid |

### Icons

- **Library**: Lucide React
- **Common Icons**: `Play`, `Pause`, `Volume2`, `VolumeX`, `Maximize`, `ChevronLeft`, `ChevronRight`, `Flame`, `Clock`, `Search`, `Filter`, `Home`, `BookOpen`, `BarChart3`, `Settings`

### WordPress GraphQL Data Structure

All data follows this WordPress GraphQL structure (defined in `types/index.ts`):

```typescript
interface Lesson {
  id: string;
  title: string;
  thumbnailUrl: string;
  durationInMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: {
    name: string;
    avatar: string;
  };
  course: {
    title: string;
  };
  progress?: number;
  completed?: boolean;
  tags: string[];
}
```

### Difficulty Badge Colors

- **Beginner**: Mint green gradient (`#10b981` → `#059669`)
- **Intermediate**: Blue (`#3b82f6`)
- **Advanced**: Amber gradient (`#f59e0b` → `#d97706`)

## Debugging Tips

- Use Next.js DevTools browser extension for runtime errors
- Check `.next` directory for build artifacts
- ESLint errors appear in the terminal during dev mode
- Use `npm run build` to catch TypeScript and build-time errors

## Project-Specific Notes

- **Current State**: Full design system implemented with glassmorphism UI
- **Font Configuration**: Uses Geist fonts configured in `app/layout.tsx`
- **ESLint**: Configured with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` for performance and type safety
