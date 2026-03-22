# Agent Workflow

## Tools used
- Copilot / LLM assistant for structural code generation and iteration.
- Terminal tools (`npm run lint`, `tsc -b`, `vite build`) to verify syntax, correctness, and build.

## Session chronology
1. Checked environment and setup `backend/` and `frontend/` directories.
2. Initialized Git repository.
3. Created backend configuration including Express app, Hexagonal wiring (Ports/Adapters).
4. Created DB migrations for schemas corresponding directly to the domain.
5. Created Backend routers handling `GET /routes`, `POST /baseline`, `GET /compliance`, `POST /banking`, `POST /pools`.
6. Verified backend with Jest (`npm run test`), achieving 100% pass on 10 backend tests.
7. Iterated on frontend by creating React Hexagonal setup, configuring Vite + TailwindCSS.
8. Created UI Components using Recharts for `CompareTab.tsx` and complex logic components for `BankingTab.tsx` and `PoolingTab.tsx`.
9. Addressed TypeScript strict mode linting rules including `.tsx` type-checking, hoisting asynchronous callbacks outside of `useEffect()`, and importing interfaces with `type`.
10. Finalized Tailwind v4 PostCSS compilation fixes.

## Prompt examples
- Generated `PostgresBankRepository.ts` implementation using task spec.
- Solved architectural logic limits for creating `Pool` instances based on deficit/surplus math.
- Addressed multiple IDE feedback and ESLint warnings autonomously.
