# DCloud Project Roadmap

DCloud is a personal web-based AI developer dashboard and GitHub assistant.

The project is being developed incrementally, with each major capability built, tested, documented, and integrated into the development branch before being released to `main`.

## Current Development State

DCloud currently provides:

- A Next.js web dashboard.
- Account-level GitHub repository retrieval.
- Repository-specific GitHub views.
- Branch, issue, pull request, and GitHub Actions data retrieval.
- Server-side GitHub integration using Octokit.
- A read-only GitHub API layer.
- An AI chat interface.
- AI provider and model selection.
- OpenAI provider support.
- Google Gemini provider support.
- Repository-aware AI assistance.
- Read-only GitHub tools available to the AI assistant.
- Server-side handling of AI and GitHub credentials.

## Development Phases

### Phase 0 — Foundation

**Completed.**

- Established the DCloud GitHub repository.
- Established the Next.js, TypeScript, and Tailwind development environment.
- Added environment configuration through `.env.example`.
- Established local development using Termux and Acode.
- Established GitHub Issues, Milestones, Pull Requests, and branch workflows.
- Established the `main` release branch and `body` development/integration branch.
- Established feature-branch development.
- Added initial project documentation.

### Phase 1 — Dashboard

**Completed.**

- Built the initial DCloud dashboard.
- Added the main dashboard navigation:
  - Dashboard
  - Repositories
  - Issues
  - Pull Requests
  - Actions
  - Chat
- Connected the dashboard to live GitHub data.
- Added repository listing and repository navigation.
- Added repository-specific views.

### Phase 2 — GitHub Integration

**Completed.**

- Integrated GitHub through Octokit.
- Added server-side GitHub API routes.
- Added account-level repository retrieval.
- Added repository metadata retrieval.
- Added branch retrieval.
- Added issue retrieval.
- Added pull request retrieval.
- Added GitHub Actions workflow-run retrieval.
- Added repository-specific GitHub data retrieval.
- Kept GitHub credentials and tokens on the server.
- Kept GitHub operations read-only.
- Added backend validation for repository-specific requests.
- Tested GitHub API routes locally through the development environment.

### Phase 3 — AI Assistant

**Completed.**

- Added the DCloud Chat interface.
- Connected the Chat interface to the DCloud backend.
- Added an AI provider abstraction.
- Added provider selection.
- Added model selection.
- Added OpenAI support.
- Added Google Gemini support.
- Added repository-aware context.
- Connected the assistant to read-only GitHub tools.
- Enabled the assistant to retrieve repository information, branches, issues, pull requests, and workflow runs.
- Added server-side validation for supported AI providers and models.
- Kept AI-assisted GitHub operations read-only.

## Current Development Focus

The initial dashboard, GitHub integration, and AI assistant foundations are now established.

The next direction of DCloud will be determined by reviewing the current architecture, validating the existing features, and defining the next development priorities.

Future roadmap phases will be added or expanded when their scope has been confirmed.