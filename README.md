# NORA

Marketing services platform for the 602North ecosystem — lead generation, quote capture, and scheduling.

## Local Development

**Prerequisites:** Node.js 22+, npm

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
cp .env.example .env.local

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Commands

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `npm run dev`        | Start development server       |
| `npm run build`      | Production build               |
| `npm run start`      | Start production server        |
| `npm run lint`       | Run ESLint                     |
| `npm run typecheck`  | Run TypeScript type checker    |
| `npm test`           | Run tests (watch mode)         |
| `npm run test:ci`    | Run tests with coverage (CI)   |

## CI/CD

GitHub Actions runs on every push and PR to `main`:

- **CI** (`.github/workflows/ci.yml`): lint → typecheck → test
- **Deploy** (`.github/workflows/deploy.yml`): static export → GitHub Pages

**Staging URL:** https://602north.github.io/nora/

## Project Structure

```
src/
  app/          Next.js App Router pages and layouts
  lib/          Shared utilities
__tests__/      Unit/integration tests
.github/
  workflows/    CI and deployment pipelines
```

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Testing:** Jest + React Testing Library
- **Linting:** ESLint (Next.js config)
- **Hosting:** GitHub Pages (staging), upgrade to Railway/Vercel for full server support
