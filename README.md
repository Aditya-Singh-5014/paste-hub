# Pastebin Lite Frontend

## Overview
This is a Next.js frontend for the Pastebin Lite API. It provides a home page to create pastes and
a viewer page to read a paste by id. All requests go through the backend API configured by
`NEXT_PUBLIC_API_BASE_URL`.

## How it works
- `src/app/page.tsx` renders the home page and the paste creation form.
- `src/components/CreatePasteForm.tsx` collects content and options, then calls the API.
- `src/app/p/[id]/page.tsx` renders the paste viewer page and handles 404s.
- `src/components/PasteViewer.tsx` displays paste content with syntax highlighting.
- `src/lib/api.ts` contains typed API calls and error handling.
- `src/lib/types.ts` defines shared request/response types used in the UI.

### Request flow (create)
1) User submits the form on `/`.
2) `CreatePasteForm` calls `createPaste` in `src/lib/api.ts`.
3) The API responds with `{ id, url }`.
4) The UI can link users to `/p/[id]` or show the returned URL.

### Request flow (view)
1) User visits `/p/[id]`.
2) `src/app/p/[id]/page.tsx` calls `fetchPaste`.
3) The viewer renders the paste or shows the Next.js 404 page.

## Setup
1) Install dependencies:
```bash
pnpm install
```

2) Configure environment variables:
```bash
copy .env.example .env.local
```

3) Run in development:
```bash
pnpm dev
```

Build and start:
```bash
pnpm build
pnpm start
```

## Environment variables
- `NEXT_PUBLIC_API_BASE_URL` (required): Base URL of the backend API, e.g. `http://localhost:3001`.

## Routes
- `/` - Create a new paste.
- `/p/[id]` - View an existing paste.

## API usage
Requests are made in `src/lib/api.ts`:
- `POST /api/pastes` to create a paste.
- `GET /api/pastes/:id` to fetch a paste.
