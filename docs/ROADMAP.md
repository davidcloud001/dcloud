DCloud Project Roadmap

DCloud is a personal web-based AI developer dashboard and GitHub assistant.

The project is developed incrementally. Major capabilities are built, tested, documented, and integrated into the "devs" development branch before being promoted to the "main" release branch.

Current Development State

DCloud currently provides:

- A Next.js web dashboard.
- Account-level GitHub repository retrieval.
- Repository-specific GitHub views.
- Branch, issue, pull request, and GitHub Actions data retrieval.
- Server-side GitHub integration through Octokit.
- A read-only GitHub API layer.
- An AI chat interface.
- AI provider and model selection.
- OpenAI provider support.
- Google Gemini provider support.
- Repository-aware AI assistance.
- Read-only GitHub tools available to the AI assistant.
- Server-side handling of AI and GitHub credentials.

Current Capability Boundary

The current DCloud implementation is intentionally read-only.

Currently supported

- Viewing GitHub repositories.
- Viewing repository metadata.
- Viewing branches.
- Viewing issues.
- Viewing pull requests.
- Viewing GitHub Actions workflow runs.
- Retrieving repository file contents through the AI assistant.
- Asking the AI assistant questions about supported GitHub data.
- Selecting an AI provider and model.
- Using repository context during AI-assisted interactions.

Not currently supported

DCloud does not currently perform GitHub write operations such as:

- Creating or editing issues.
- Creating or modifying branches.
- Creating commits.
- Creating or modifying files.
- Creating pull requests.
- Merging pull requests.
- Triggering or modifying GitHub Actions.
- Performing other repository-changing operations.

Future write capabilities may be considered only after their scope, permissions, validation, and safety requirements have been defined.

Development Phases

Phase 0 — Foundation

Completed.

- Established the DCloud GitHub repository.
- Established the Next.js, TypeScript, and Tailwind development environment.
- Added environment configuration through ".env.example".
- Established local development using Termux and Acode.
- Established GitHub Issues, Milestones, Pull Requests, and branch workflows.
- Established the "main" release branch and "devs" development/integration branch.
- Established feature-branch development.
- Added initial project documentation.

Phase 1 — Dashboard

Completed.

- Built the initial DCloud dashboard.
- Added the main dashboard navigation:
  - Dashboard
  - Repositories
  - Issues
  - Pull Requests
  - Actions
  - Chat
- Connected the dashboard to live GitHub data.
- Added account-level repository listing.
- Added repository selection and repository-specific navigation.
- Added repository-specific views.

Phase 2 — GitHub Integration

Completed.

- Integrated GitHub through Octokit.
- Added server-side GitHub API routes.
- Added account-level repository retrieval.
- Added repository metadata retrieval.
- Added branch retrieval.
- Added issue retrieval.
- Added pull request retrieval.
- Added GitHub Actions workflow-run retrieval.
- Added repository-specific GitHub data retrieval.
- Added repository file-content retrieval for AI-assisted use.
- Kept GitHub credentials and tokens on the server.
- Kept GitHub operations read-only.
- Added backend validation for repository-specific requests.
- Tested GitHub API routes locally through the development environment.

Phase 3 — AI Assistant

Completed.

- Added the DCloud Chat interface.
- Connected the Chat interface to the DCloud backend.
- Added an AI provider abstraction.
- Added provider selection.
- Added model selection.
- Added OpenAI support.
- Added Google Gemini support.
- Added repository-aware context.
- Connected the assistant to read-only GitHub tools.
- Enabled the assistant to retrieve repository information, branches, issues, pull requests, workflow runs, and repository file contents.
- Added server-side validation for supported AI providers and models.
- Kept AI-assisted GitHub operations read-only.

Current Development Focus

The initial dashboard, GitHub integration, and AI assistant foundations are now established.

The current focus is to:

1. Review the existing architecture.
2. Validate the implemented dashboard and GitHub functionality.
3. Validate the AI provider and model architecture.
4. Keep the documentation synchronized with the actual implementation.
5. Identify limitations, cleanup opportunities, and architectural improvements.
6. Define the next development milestone based on the validated state of the project.

No new major roadmap phase is considered active until its scope has been reviewed and confirmed.

Future Development

Future phases may expand DCloud beyond its current read-only capabilities.

Potential future areas include:

- More advanced repository analysis.
- More GitHub data sources.
- Improved AI context handling.
- Expanded AI tools.
- Controlled GitHub write operations.
- More advanced development workflow automation.

These are future possibilities rather than completed capabilities and should not be treated as implemented until they are built, tested, and documented.

Roadmap Principles

DCloud development follows these principles:

- Build incrementally.
- Keep features focused.
- Validate functionality before integration.
- Keep documentation aligned with the actual codebase.
- Keep sensitive credentials server-side.
- Avoid hardcoding DCloud to a single repository.
- Keep the current GitHub integration read-only until controlled write capabilities are deliberately designed.
- Promote validated work through "devs" before releasing it to "main".

The roadmap should be updated whenever a major capability is completed or the project's development direction changes.
