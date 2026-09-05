# DCloud Project Roadmap

DCloud is a personal web-based AI coding and GitHub assistant designed for the `davidcloud001` environment. It is built incrementally using professional software engineering practices and GitHub workflows.

## Development Phases

### Phase 0 — Foundation
- Establish project structure, development environment, environment configuration templates (`.env.example`), and project documentation.
- Track development using GitHub Issues and Milestones.
- Establish a clean Git workflow using `main`, `dev`, and feature branches.

### Phase 1 — Dashboard
- Create the initial usable DCloud dashboard UI.
- Core sections:
  - Dashboard
  - Repositories
  - Issues
  - Pull Requests
  - Actions
  - Chat
- Provide a foundation for displaying live GitHub data.

### Phase 2 — GitHub Integration
- Implement secure, read-only GitHub capabilities using Octokit on the backend.
- Integrate DCloud with the `davidcloud001` GitHub account rather than limiting the dashboard to a single repository.
- Retrieve all repositories accessible to `davidcloud001`.
- Retrieve repository metadata for each repository.
- Support repository-specific retrieval of:
  - Branches
  - Issues
  - Pull Requests
  - GitHub Actions workflow runs
- Allow the dashboard to display account-level GitHub information and provide repository-specific drill-down views.
- Keep GitHub credentials and tokens strictly on the server.
- Do not expose GitHub credentials or tokens to frontend code or browser requests.
- Keep Phase 2 strictly read-only.

#### Phase 2 Acceptance Criteria
- DCloud can retrieve the repositories accessible to `davidcloud001`.
- The dashboard can display the retrieved repositories using live GitHub data.
- Repository-specific data can be retrieved for each selected repository.
- Branches can be retrieved for a selected repository.
- Issues can be retrieved for a selected repository.
- Pull requests can be retrieved for a selected repository.
- GitHub Actions workflow runs can be retrieved for a selected repository.
- Empty collections are handled cleanly and returned as valid JSON.
- GitHub API credentials are stored in environment variables and remain server-side.
- No GitHub token is hardcoded into source code.
- Backend API routes are tested locally through Termux.
- Changes are submitted through a Pull Request targeting the `dev` branch.
- Pull Request completion closes the corresponding GitHub integration issue.

### Phase 3 — AI Assistant
- Integrate the Chat interface with the assistant backend using the Google Gemini SDK.
- Enable the assistant to understand natural-language developer requests.
- Allow the assistant to retrieve relevant GitHub information through the read-only GitHub integration established in Phase 2.
- Provide repository-aware context so the assistant can understand which repository the user is working with.
- Keep AI operations read-only initially.

### Phase 4 — Controlled GitHub Actions
- Introduce tools allowing the assistant to perform controlled GitHub actions, including:
  - Creating issues
  - Creating branches
  - Creating pull requests
  - Creating commits
  - Updating repository files
  - Triggering workflows
- Require explicit user confirmation before write operations.
- Apply appropriate permission boundaries to GitHub operations.
- Keep destructive or high-impact operations behind additional safeguards.

### Phase 5 — Coding Assistant
- Expand the assistant into a repository-aware coding assistant.
- Understand repository structure and relevant source files.
- Analyze application errors and stack traces.
- Investigate GitHub Actions workflow failures.
- Inspect issues and pull requests to understand development context.
- Suggest fixes and implementation strategies.
- Generate and modify code with appropriate user confirmation.
- Support development workflows across repositories managed by `davidcloud001`.

### Phase 6 — MCP / Agent Architecture
- Evaluate and introduce Model Context Protocol (MCP) when it provides a clear architectural advantage.
- Use MCP or agent-based architecture where it improves the assistant's ability to interact with GitHub, repositories, development tools, and other supported services.
- Avoid introducing additional architectural complexity unless it provides a clear benefit.

### Phase 7 — DavidCloud Developer Platform
- Long-term vision for a comprehensive personal developer control center.
- Combine:
  - GitHub management
  - AI coding assistance
  - Repository intelligence
  - CI/CD monitoring
  - Developer activity dashboards
  - Automated development workflows
  - Controlled AI-assisted engineering operations
- Evolve DCloud into a centralized developer platform for the `davidcloud001` environment.