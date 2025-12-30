# Posts_crud

[![Next.js](https://img.shields.io/badge/-Next.js-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org) [![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org) [![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com) [![React Query](https://img.shields.io/badge/-React_Query-FF4154?style=flat&logo=@tanstack&logoColor=white)](https://tanstack.com/query) [![Zustand](https://img.shields.io/badge/-Zustand-000000?style=flat&logo=Zustand&logoColor=white)](https://github.com/pmndrs/zustand) [![Radix UI](https://img.shields.io/badge/-Radix_UI-111827?style=flat&logo=radix-ui&logoColor=white)](https://www.radix-ui.com) [![Framer Motion](https://img.shields.io/badge/-Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)](https://www.framer.com/motion/) [![Biome](https://img.shields.io/badge/-Biome-6B7280?style=flat&logo=biome&logoColor=white)](https://biomejs.dev)

A simple, extensible Next.js app that demonstrates a full CRUD flow for posts (text + media).

## Features ✅

- Create, read, update and delete posts
- Media upload and display, pagination, and modals (edit, delete, share)
- Optimistic updates and client caching via **React Query**
- Local UI state with **Zustand** and reusable hooks/providers (e.g., `usePosts`, `QueryProvider`)
- Accessible, animated UI built with **Radix** + **Tailwind CSS** + **Framer Motion**

## Tech stack ⚙️

- **Next.js 16 (App Router)** + **TypeScript**
- **Tailwind CSS**, **PostCSS**
- **@tanstack/react-query**, **Zustand**
- **Radix UI**, **Framer Motion**, **Lucide** icons, **Sonner** (toasts)
- Dev: **Biome** (lint/format)

## Project structure 📁

- `app/` – routes, layouts and pages (App Router)
- `components/` – UI components and feature groups
- `hooks/` – reusable hooks (e.g., `usePosts`)
- `lib/` – API client and helpers
- `store/` – global state
- `public/` – static assets

## Quick start 🚀

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open: `http://localhost:3000`

## Development notes 🔧

- Lint: `npm run lint` (Biome)
- Format: `npm run format`
- Build: `npm run build`

## Screenshots 🖼️

A table showing the app screenshots (2 columns × 3 rows):

| Screenshot                           | Screenshot                           |
| ------------------------------------ | ------------------------------------ |
| ![Screenshot 1](public/prints/1.png) | ![Screenshot 2](public/prints/2.png) |
| ![Screenshot 3](public/prints/3.png) | ![Screenshot 4](public/prints/4.png) |
| ![Screenshot 5](public/prints/5.png) | ![Screenshot 6](public/prints/6.png) |

## Contributing

Contributions and issues are welcome — please open a PR or issue with a short description of the change.

## License

No license specified.
