# DCloud Project Roadmap

DCloud is a personal web-based AI coding and GitHub assistant designed for the `davidcloud001` environment. It is built incrementally using professional software engineering and GitHub workflows.

## Development Phases

### Phase 0 — Foundation
- Establish project structure, development environment, environment configuration templates (`.env.example`), and project documentation.
- Track development using GitHub Issues and Milestones.

### Phase 1 — Dashboard
- Create the initial usable DCloud dashboard UI.
- Core sections: Dashboard, Repositories, Issues, Pull Requests, Actions, and Chat.

### Phase 2 — GitHub Integration
- Implement read-only GitHub capabilities using Octokit securely on the backend.
- Retrieve repositories, repository metadata, branches, issues, pull requests, and workflow runs.

### Phase 3 — AI Assistant
- Integrate the chat interface with the assistant backend using the Google Gemini SDK.
- Enable the assistant to understand requests and retrieve relevant GitHub information.

### Phase 4 — Controlled GitHub Actions
- Introduce tools allowing the assistant to perform controlled GitHub actions (e.g., creating issues, branches, pull requests, commits, updating files, and triggering workflows).
- Enforce explicit user confirmation for write operations.

### Phase 5 — Coding Assistant
- Expand the assistant into a coding assistant capable of understanding repository structure, analyzing errors, investigating workflow failures, suggesting fixes, and generating code.

### Phase 6 — MCP / Agent Architecture
- Evaluate and introduce Model Context Protocol (MCP) when it provides a clear architectural advantage for connecting the assistant to developer tools.

### Phase 7 — DavidCloud Developer Platform
- Long-term vision for a comprehensive personal developer control center combining GitHub management, AI coding assistance, CI/CD monitoring, and developer activity dashboards.
