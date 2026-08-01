# Atlas Recruiter OS

## Project Vision
Atlas Recruiter OS is an AI-powered Recruiter Operating System designed to help recruiters identify, understand, and engage technical talent faster.

## Technology Stack
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- GitHub
- GitHub Copilot
- Supabase (future)

## Development Principles
- Components should be small and reusable.
- Use TypeScript strict typing.
- Avoid duplicated logic.
- Keep business logic outside UI components whenever possible.
- Follow clean architecture.

## Folder Structure

### Root
- README.md — Project overview and setup instructions.
- ATLAS.md — Engineering documentation and product direction.

### web/
- app/ — App Router pages, layouts, and route-level UI.
  - globals.css — Global styling entry point.
  - layout.tsx — Root layout for the application.
  - page.tsx — Home page entry.
  - recruiter-search/ — Recruiter search feature route.
- components/ — Reusable UI building blocks.
  - common/ — Shared cross-cutting components.
  - dashboard/ — Dashboard-specific components.
  - layout/ — Header, sidebar, and layout shell components.
  - recruiter/ — Recruiter-focused components.
  - ui/ — Base UI components built with shadcn/ui patterns.
- lib/ — Shared utilities and helpers.
- public/ — Static assets served by the app.
- components.json — shadcn/ui configuration.
- eslint.config.mjs — Linting configuration.
- next.config.ts — Next.js configuration.
- package.json — Project dependencies and scripts.
- postcss.config.mjs — PostCSS configuration.
- tsconfig.json — TypeScript compiler configuration.

## UI Principles
- Modern
- Minimal
- Fast
- Recruiter-first
- Responsive

## Coding Standards
- Use PascalCase for React components.
- Use camelCase for variables and functions.
- Keep components under 200 lines when practical.
- Prefer composition over large files.
