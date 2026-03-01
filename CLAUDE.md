# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AGI Institute education platform ("Bildung trifft KI" — Education meets AI). A course management and learning platform with real-time collaboration, AI-powered course creation, and collaborative whiteboard features.

## Repository Structure

```
intuitive.AI/
├── nextJsFrontCourse/    # Next.js 15 frontend
├── parseServerCourse/    # Parse Server + GraphQL backend
└── AgiVercityTest/       # Cypress test suite
```

## Commands

### Frontend (nextJsFrontCourse/)
```bash
cd nextJsFrontCourse
npm run dev       # Development server
npm run build     # Production build
npm run lint      # ESLint
npm run start     # Production server
```

### Backend (parseServerCourse/)
```bash
cd parseServerCourse
node app.mjs      # Start Parse Server (npm start also works)
```

### Tests (AgiVercityTest/)
```bash
cd AgiVercityTest
npx cypress open  # Interactive test runner
npx cypress run   # Headless test run
```

## Frontend Architecture

**Framework**: Next.js 15 with App Router (`/app` directory), React 19

**Directory conventions**:
- `/app/` — Page routes (file-based routing)
- `/features/` — Feature-first modules (each feature owns its components, hooks, schemas, and API layer)
- `/components/` — Shared/reusable UI components
- `/utils/` — Apollo client setup (`apolloClient.js`) and Axios instance (`indexApi.js`)

**Data fetching**: Apollo Client for all GraphQL queries/mutations. The client is configured in `utils/apolloClient.js` and wraps the app via a provider. Auth headers are injected from `localStorage`.

**Forms**: React Hook Form + Zod for validation. Schemas live in `features/<feature>/schemas/`.

**Real-time**: Socket.IO client (`socket.io-client`) for whiteboard collaboration. Logic is encapsulated in `features/whiteboard/hooks/useWhiteboardCollab.js`.

**Styling**: Chakra UI v3 with `defaultSystem`. No Tailwind — use Chakra's props and the Emotion system. Global styles in `app/globals.css`.

**Auth**: User session stored in `localStorage` as JSON (session token from Parse Server). Check `localStorage` for user data before making authenticated requests.

**Import alias**: `@/` maps to the `nextJsFrontCourse/` root.

## Backend Architecture

**Stack**: Express.js + Parse Server (MongoDB) + custom GraphQL layer + Socket.IO

**Entry point**: `parseServerCourse/app.mjs` — sets up Express, mounts Parse Server, attaches custom GraphQL resolvers, and initializes Socket.IO.

**Business logic**: `parseServerCourse/cloud/` — Parse Cloud Functions. Each domain has its own file (`auth.js`, `course.js`, `section.js`, `question.js`, etc.). All are imported in `cloud/main.js`.

**GraphQL schema**: `parseServerCourse/graphql/` — `.graphql` files define types, queries, and mutations. Resolvers call Parse Cloud Functions internally.

**Database models**: `parseServerCourse/schemas/` — JSON schema definitions for Parse classes (`Course`, `Section`, `Question`, `Answer`, `_User`, etc.).

**Real-time**: `parseServerCourse/collab/whiteboardCollab.mjs` — Socket.IO room management. Rooms are stored in memory. Key events: `join-room`, `leave-room`, `whiteboard-update`, `users-updated`, `permission-updated`.

**AI integrations**: `cloud/aiAssistent.js` and `cloud/generateCourseTitles.js` use OpenAI and Google GenAI SDKs. Credentials come from environment variables (`.env`).

## Key Patterns

- **Feature modules** in `/features/` are self-contained: `components/`, `hooks/`, `schemas/`, `api/` subdirectories per feature.
- **GraphQL mutations** are defined close to the feature that uses them (e.g., `features/auth/api/`).
- **Socket.IO permissions**: trainers can grant draw permissions to viewers; permission state is managed server-side in memory per room.
- **Parse Cloud Functions** are the primary backend abstraction — avoid direct database access outside of cloud functions.
