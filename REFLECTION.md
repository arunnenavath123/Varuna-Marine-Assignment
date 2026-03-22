# Reflection

Working with the AI assistant in this project was highly productive: it accelerated scaffolding, file creation, and generative code patterns. The prompt was very clear on architecture and deliverables, which reduced overhead decision-making.

Positives:
- AI helped handle repetitive boilerplate quickly in both backend and frontend.
- Smart dependency and repo setup (tsconfig, jest config, server container) saved hours of config.
- Translating complex FuelEU business logic (such as calculating pool constraints under Article 21, and banking logic under Article 20) directly to frontend UI components and charts was exceptionally fast.

Challenges:
- Minor syntax issue from apostrophe in string literal in `CreatePoolUseCase` required a simple fix.
- Navigating the Vite and Tailwind v4 upgrade syntax was tricky (`@tailwindcss/postcss` setup over old config patterns caused a brief build failure).
- Adhering to strict typing (avoiding `any`) across a split React/Node project required several iterative linting fixes (`ESLint` and `tsc -b`).

What I’d do differently:
- Maintain stronger typing for API responses in a shared `types` or `monorepo` folder rather than redefining DTOs in both backend and frontend endpoints.
- Add an auto-run command script for migration execution and DB initialization.
- Implement more robust frontend e2e routing and tests early to ensure UI behavior independently.
