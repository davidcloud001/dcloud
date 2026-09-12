DCloud

DCloud is a personal web-based AI developer dashboard and GitHub assistant.

It provides a central interface for viewing GitHub repositories and repository activity while also providing an AI chat interface with access to read-only GitHub information.

Current Capabilities

- GitHub account-level repository listing
- Repository-specific views
- Branch, issue, pull request, and GitHub Actions data
- Repository file-content retrieval for supported AI-assisted workflows
- Read-only GitHub integration through the backend
- AI chat with provider and model selection
- OpenAI provider support
- Google Gemini provider support
- Repository-aware AI assistance
- Read-only GitHub tools available to the AI assistant
- Server-side handling of GitHub and AI provider credentials

Current Capability Boundary

DCloud currently uses GitHub as a read-only data source.

The assistant can retrieve and analyze supported GitHub information but does not currently perform GitHub write operations such as creating commits, modifying files, creating pull requests, or changing repository configuration.

Technology

- Next.js
- TypeScript
- Tailwind CSS
- Octokit
- OpenAI
- Google Gemini
- GitHub API

Development

Install dependencies:

npm install

Start the local development server:

npm run dev

Validate the project:

npm run lint
npm run build -- --webpack

Environment configuration is provided through `.env.example`.

Documentation

- [Roadmap](docs/ROADMAP.md) — project progress, capabilities, and development phases
- [Architecture](docs/ARCHITECTURE.md) — application architecture and component relationships
- [Development Guide](docs/DEVELOPMENT.md) — development, testing, Git, documentation, and release workflow

Branching

DCloud uses:

main
  ↑
devs
  ↑
feat/*

"devs" is the development and integration branch.

"main" is the stable release branch.

Feature branches are created from "devs" and normally merged back into "devs" through pull requests.
