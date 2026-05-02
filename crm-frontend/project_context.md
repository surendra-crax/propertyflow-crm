---
name: PropertyFlow CRM — Project Context
description: Core facts about the PropertyFlow CRM platform deployment, stack, and constraints
type: project
---

PropertyFlow CRM is a real estate sales CRM targeting Indian real estate developers.

**Deployment**: Vercel (Next.js 16 frontend) + Render (NestJS API) + PostgreSQL (Prisma ORM)
**Why:** Render free tier has cold starts causing slow login (10-30s). Vercel is fast but API is the bottleneck.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Shadcn/UI, NestJS 11, Prisma 6, PostgreSQL
**New packages added:** @tanstack/react-query, leaflet, react-leaflet, framer-motion

**Auth:** JWT in localStorage (not httpOnly — known XSS risk, not yet fixed). No refresh tokens. Backend has hardcoded JWT secret fallback 'supersecretkey' if JWT_SECRET env not set.

**How to apply:** When suggesting performance fixes, remember Render cold starts are the #1 cause of slow login. React Query was added with 60s staleTime to reduce refetches.
