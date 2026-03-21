# Agent Workflow

## Tools used
- GitHub Copilot (Raptor mini Preview) in VSCode
- Terminal commands to bootstrap packages, create directories, and run tests

## Session chronology
1. Inspected project structure with `list_dir` and `read_file`.
2. Installed backend dependencies with `npm install` (workaround for PowerShell execution policy via `cmd /c`).
3. Created skeleton folders and initial config files (`tsconfig`, `.eslintrc`, `.prettierrc`, `package.json` scripts).
4. Implemented core domain interfaces and compliance math.
5. Added ports and use-case classes using dependency injection.
6. Built DB schema migration and seed SQL plus Postgres adapter implementation.
7. Built HTTP routers and Express app with global error handling.
8. Added unit tests and ran `npx jest --runInBand`; fixed syntax bug in CreatePoolUseCase string quoting.
9. Completed backend compile with `npm run build`; installed missing `@types/cors`.
10. Bootstrapped frontend with Vite and installed Tailwind, Axios, Recharts, ESLint, Prettier.
11. Implemented frontend domain/ports/application/plant wiring and sample tabbed UI.
12. Wrote required docs (`README.md`, `AGENT_WORKFLOW.md`, `REFLECTION.md`).

## Prompt examples
- Provided the full user request for functionality and scaffold details.
- Followed plan section by section while writing code.
