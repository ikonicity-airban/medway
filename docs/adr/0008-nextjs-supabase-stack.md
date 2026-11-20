# 0008: Next.js 15 App Router and Supabase Full-Stack Architecture

**Status:** Accepted  
**Date:** 2026-11-20

## Context & Problem Statement

MedWay requires an enterprise-ready, accessible, and high-performance web architecture supporting edge routing algorithms, fast mobile client rendering, real-time telemetry syncing, and structured data persistence across student and partner portals.

## Decision Outcome

Chosen option: "Next.js 15 App Router + TypeScript + Tailwind CSS + Supabase", providing server-rendered shells, edge API routes, PostgreSQL with Row-Level Security (RLS), and direct compatibility with the engineering workflow skill suite (`/scope`, `/architect`, `/develop`, `/test`).

## Consequences

- **Positive:** Modern component architecture; robust typing; native support for progressive web app service workers; low-latency PostgreSQL queries via Supabase.
- **Negative / Trade-offs:** Node.js/Vercel runtime footprint; requires managing Supabase client initialization in mixed SSR/CSR contexts.

## Considered Options

- Next.js 15 App Router + TypeScript + Tailwind CSS + Supabase (Chosen)
- Vite + React 19 + Zustand + Supabase (Rejected: Lacks native edge API routing and built-in server optimization)
- Next.js 15 + Prisma + PostgreSQL (Self-Hosted) (Rejected: Increased DevOps overhead and infrastructure maintenance)
