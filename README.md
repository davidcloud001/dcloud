# DCloud

DCloud is a personal web-based AI developer dashboard and GitHub assistant.

It provides a central interface for viewing GitHub repositories and repository activity, while also providing an AI chat interface with access to read-only GitHub information.

## Current Capabilities

- GitHub account-level repository listing
- Repository-specific views
- Branch, issue, pull request, and GitHub Actions data
- Read-only GitHub integration through the backend
- AI chat with provider/model selection
- OpenAI and Gemini provider support
- Repository-aware AI assistance
- Read-only GitHub tools available to the AI assistant

## Technology

- Next.js
- TypeScript
- Tailwind CSS
- Octokit
- OpenAI
- Google Gemini
- GitHub API

## Development

Install dependencies:

    npm install

Start the local development server:

    npm run dev

Validate the project with:

    npm run lint
    npm run build -- --webpack

Environment configuration is documented in `.env.example`.

## Documentation

Additional project documentation is available in:

- `docs/ROADMAP.md` — project progress and development phases
- `docs/ARCHITECTURE.md` — application architecture
- `docs/DEVELOPMENT.md` — development and Git workflow
