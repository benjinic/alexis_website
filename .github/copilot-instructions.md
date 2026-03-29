# Project Guidelines

## Code Style
- Use TypeScript-first patterns and keep strict typing compatible with `tsconfig.json` (`strict: true`, `@/*` path alias).
- Follow existing UI patterns in `src/components` and page composition patterns in `src/app`.
- Keep brand styling consistent with `design.md` and tokens in `tailwind.config.ts`.
- For this project UI language, keep controls sharp/square (`rounded-none`) unless an existing local pattern clearly differs.

## Architecture
- This is a hybrid Next.js 16 app: App Router pages and route handlers in `src/app`, plus Pages API endpoints in `src/pages/api`.
- AI features are built with Genkit/Vertex flows under `src/ai`; keep AI orchestration there instead of embedding flow logic directly in UI files.
- Firebase Hosting/Cloud Run deployment is function-backed via `functions/index.js` and config in `firebase.json`.
- Shared Firebase utilities and initialization live in `src/lib` (`firebase.ts`, `firebase-admin.ts`).

## Build and Test
- Install: `npm install`
- Local dev: `npm run dev`
- Production build: `npm run build`
- Runtime safety gate: `npm run check:deploy-runtime`
- Functions-compatible build copy: `npm run build:functions`
- Lint: `npm run lint`
- E2E tests: `npm run test:e2e` (or `npm run test:e2e:headed`)
- Recommended deploy path: `npm run deploy:prod`

## Conventions
- API error handling:
  - Wrap request parsing in try/catch.
  - Invalid JSON should return 400-class responses rather than generic 500s.
- Respect existing request size constraints for image/AI flows (10MB limits in API/server action config).
- Keep `/collection` behavior aligned with current redirect-to-`/bespoke` flow; avoid reintroducing duplicate bespoke paths.
- Before deploy-related changes, ensure function-backed rewrite expectations still pass the runtime gate script.

## Docs and References
- Start with `README.md` for project status, key routes, and ops commands.
- Deployment checklists:
  - `docs/cloud-run-predeploy-checklist-1min.md`
  - `docs/cloud-run-predeploy-checklist.md`
- Brand/design guidance: `design.md` and `docs/brand-book.md`.
- Blueprint/product context: `docs/blueprint.md` and `ROADMAP.md`.

## Common Pitfalls
- Mixing App Router and Pages API patterns in the wrong directory.
- Skipping `npm run check:deploy-runtime` before deploy changes.
- Missing Firebase env/auth configuration differences between local dev and cloud runtime.
- Breaking bespoke asset paths (base/lapel/pocket/fabric) without verifying route/runtime behavior.