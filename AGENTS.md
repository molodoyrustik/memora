<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Architecture

## Overview

This project uses Next.js App Router and follows a layered architecture inspired by Feature-Sliced Design.

Main folders:

- `app/` — routing layer, layouts, pages, route-level loading/error boundaries
- `features/` — user scenarios and business use-cases
- `entities/` — domain entities and their related types, mappers, and basic UI
- `shared/` — reusable UI, utilities, infrastructure, and cross-page client state

The project should keep routing concerns separate from business logic and domain modeling.

---

## Tech Stack

- Next.js with App Router
- TypeScript
- React
- Zustand for client state
- Server Components by default
- Client Components only when interactivity is required

---

## Architectural Principles

### 1. App Router is a routing/composition layer

The `app/` directory is responsible for:

- route definitions
- `layout.tsx`
- `page.tsx`
- `loading.tsx`
- `error.tsx`
- reading `params` and `searchParams`
- top-level page composition

The `app/` layer should stay thin.

Do not place complex business logic, domain mapping, reusable UI, or shared helpers directly inside `app/`.

---

### 2. Server-first approach

By default, components should be Server Components.

Use Server Components for:

- data fetching
- page orchestration
- static or read-only UI
- route-level composition
- access to server-only resources

Use Client Components only for:

- `useState`
- `useEffect`
- browser APIs
- event handlers
- interactive forms
- Zustand usage
- local UI interactions

Rule:
- prefer Server Components
- move to Client Components only when interactivity is needed

---

### 3. Features represent user scenarios

`features/` contains user actions and business scenarios.

Examples:
- login
- update-user
- create-order
- filter-users
- add-to-cart

A feature is not just a reusable component. It represents a meaningful user-facing action or workflow.

Features may contain:
- UI
- local model
- form schema
- validation
- feature-specific state
- feature-specific API calls

---

### 4. Entities represent domain concepts

`entities/` contains domain entities.

Examples:
- user
- product
- order
- application
- merchant

Entities may contain:
- domain types
- mappers
- DTO transformations
- basic UI tied to the entity
- entity-specific API functions
- pure domain helpers

Entities should not contain route logic.

---

### 5. Shared is for reusable infrastructure

`shared/` contains cross-cutting reusable code.

Examples:
- design system components
- generic UI components
- utility functions
- date/number formatters
- HTTP client
- constants
- generic hooks
- app-wide Zustand stores

Typical structure:

- `shared/ui/`
- `shared/lib/`
- `shared/api/`
- `shared/config/`
- `shared/state/`

`shared/` must not become a dumping ground for random business logic.

---

## Folder Responsibilities

### `app/`
Use for:
- route entrypoints
- route layouts
- route-level loading/error boundaries
- route composition
- reading route params
- server-side orchestration

Do not use for:
- reusable business components
- domain mappers
- shared helpers
- generic UI kit components

---

### `features/`
Use for:
- user flows
- interactive feature UI
- business use-cases
- feature forms
- feature validation
- feature-specific client state

Do not use for:
- base domain types
- route definitions
- generic shared UI

---

### `entities/`
Use for:
- domain models
- entity types
- entity mappers
- entity-specific read models
- small entity-oriented UI blocks

Do not use for:
- route logic
- app-wide state
- unrelated generic utilities

---

### `shared/`
Use for:
- reusable UI
- infrastructure
- helpers
- common config
- cross-page client state
- app-level providers

Do not use for:
- specific business workflows
- route-specific logic
- feature-specific validation rules

---

## Server and Client Component Rules

### Default rule
All components are Server Components unless there is a clear need for client behavior.

### Use Server Components when
- fetching data
- rendering page content from server data
- composing layouts/pages
- rendering static UI
- passing fetched data down to children

### Use Client Components when
- using React hooks like `useState`, `useEffect`, `useMemo`
- handling clicks, input events, form state
- using Zustand
- using browser APIs like `localStorage`, `window`, `document`
- implementing interactive widgets

### Important rule
Client Components should be leaf nodes whenever possible.

Preferred pattern:

- server page fetches data
- server page passes data to client child if interaction is needed

Avoid making entire pages client components unless necessary.

---

## Data Flow

Preferred data flow:

`server -> props -> client`

Pattern:
1. fetch data in Server Component
2. pass serializable data to Client Component
3. handle interactivity in Client Component

Avoid fetching primary page data in `useEffect` unless there is a strong reason.

---

## Zustand Rules

Zustand is used only in Client Components.

### Where to store Zustand
- feature-specific store → inside the corresponding feature
- app-wide or cross-page store → `shared/state/`

Examples:
- `shared/state/counter/`
- `shared/state/theme/`
- `shared/state/sidebar/`

### Provider placement
- if state is needed across the whole app, place provider in `app/layout.tsx`
- if state is needed only inside a route subtree like `/users/*`, place provider in `app/users/layout.tsx`

### Important rules
- do not use Zustand directly in Server Components
- do not put app-wide Zustand stores inside `features/` or `entities/`
- prefer local component state over global Zustand when state does not need to be shared

---

## Routing Structure

The `app/` layer mirrors the URL structure.

Example:

- `app/page.tsx` → `/`
- `app/about/page.tsx` → `/about`
- `app/users/page.tsx` → `/users`
- `app/users/[userId]/page.tsx` → `/users/:userId`

Layouts should be used to define persistent UI per route subtree.

Example:
- root layout for global shell
- `app/users/layout.tsx` for users section shell

---

## Example Folder Structure

```text
app/
├── layout.tsx
├── page.tsx
├── about/
│   └── page.tsx
├── users/
│   ├── layout.tsx
│   ├── page.tsx
│   └── [userId]/
│       └── page.tsx

features/
├── user-list/
│   ├── ui/
│   └── model/
├── user-details/
│   ├── ui/
│   └── model/
├── update-user/
│   ├── ui/
│   ├── model/
│   └── api/

entities/
├── user/
│   ├── model/
│   │   ├── types.ts
│   │   ├── mappers.ts
│   │   └── selectors.ts
│   ├── api/
│   │   └── user-api.ts
│   └── ui/
│       └── user-card.tsx

shared/
├── ui/
├── lib/
├── api/
├── config/
└── state/
    └── counter/