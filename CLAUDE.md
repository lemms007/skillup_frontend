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

The app consumes data from a WordPress GraphQL server. Check `app/page.tsx` and related components for GraphQL query patterns.

## Project-Specific Notes

- **Current State**: Starter template - the app has basic Next.js scaffolding with placeholder content
- **Font Configuration**: Uses Geist fonts configured in `app/layout.tsx`
- **ESLint**: Configured with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` for performance and type safety

## Debugging Tips

- Use Next.js DevTools browser extension for runtime errors
- Check `.next` directory for build artifacts
- ESLint errors appear in the terminal during dev mode
- Use `npm run build` to catch TypeScript and build-time errors
