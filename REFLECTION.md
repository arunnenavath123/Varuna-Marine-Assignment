# Reflection

Working with the AI assistant in this project was highly productive: it accelerated scaffolding, file creation, and generative code patterns. The prompt was very clear on architecture and deliverables, which reduced overhead decision-making.

Positives:
- AI helped handle repetitive boilerplate quickly in both backend and frontend.
- Smart dependency and repo setup (tsconfig, jest config, server container) saved ~1 hour.

Challenges:
- Minor syntax issue from apostrophe in string literal in `CreatePoolUseCase` required a simple fix.
- One type missing (`@types/cors`), which was resolved via the compiler error.

What I’d do differently:
- Add an auto-run command script for migration execution and DB initialization.
- Implement more robust frontend routing and tests early to ensure UI end-to-end behavior.
