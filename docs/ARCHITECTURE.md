# DCloud Architecture

DCloud is built as a Next.js web application with a server-side integration layer for GitHub and AI providers.

The architecture separates the user interface, backend API routes, external integrations, and AI provider implementations.

## Application Structure

```text
DCloud
│
├── Frontend
│   ├── Dashboard
│   ├── Repositories
│   └── Chat
│
├── Backend API
│   ├── Chat API
│   └── GitHub API routes
│
├── GitHub Integration
│   └── Octokit
│
└── AI Provider Layer
    ├── OpenAI
    └── Google Gemini
```

## Frontend

The frontend is implemented using the Next.js App Router.

Main application areas include:

- Dashboard
- Repositories
- Repository-specific views
- Chat

The frontend is responsible for displaying GitHub data and providing the user interface for interacting with the AI assistant.

## Backend API

DCloud uses Next.js server-side API routes to handle requests that require protected credentials or external services.

The backend includes:

- `/api/chat` — handles AI assistant requests.
- `/api/github/repositories` — retrieves GitHub repositories.
- `/api/github/branches` — retrieves repository branches.
- `/api/github/issues` — retrieves repository issues.
- `/api/github/pull-requests` — retrieves repository pull requests.
- `/api/github/workflow-runs` — retrieves GitHub Actions workflow runs.

Repository-specific requests use the selected repository rather than hardcoding DCloud to a single repository.

## GitHub Integration

GitHub integration is implemented through Octokit.

The main GitHub integration is located in:

```text
src/lib/github.ts
```

It provides server-side functions for retrieving:

- Repositories
- Repository metadata
- Branches
- Issues
- Pull requests
- GitHub Actions workflow runs

GitHub credentials are stored in environment variables and remain on the server.

The current GitHub integration is read-only.

## AI Assistant

The Chat interface communicates with:

```text
/api/chat
```

The chat backend validates the requested AI provider and model before processing the request.

The assistant can use read-only GitHub tools to retrieve relevant GitHub information.

Current read-only tools include:

- List repositories
- Get repository metadata
- List branches
- List issues
- List pull requests
- List GitHub Actions workflow runs
- Get repository file contents
  
The assistant does not perform GitHub write operations.

## AI Provider Layer

DCloud separates AI provider implementations from the main chat API.

The provider layer is located in:

```text
src/lib/providers/
```

It currently contains:

```text
src/lib/providers/
├── types.ts
├── index.ts
├── openai.ts
└── gemini.ts
```

This abstraction allows the Chat system to support multiple AI providers while keeping provider-specific implementation details separate from the main chat API.

Current providers are:

- OpenAI
- Google Gemini

The Chat interface also supports provider and model selection.

## Environment Configuration

Environment variables are used for protected credentials and configuration.

The example configuration is stored in:

```text
.env.example
```

Sensitive credentials such as GitHub and AI provider API keys are intended to remain server-side and must not be exposed through frontend code.

## Request Flow

A typical AI-assisted GitHub request follows this general flow:

```text
User
 │
 ▼
DCloud Chat UI
 │
 ▼
/api/chat
 │
 ├── AI Provider Layer
 │       ├── OpenAI
 │       └── Google Gemini
 │
 └── Read-only GitHub Tools
         │
         ▼
       Octokit
         │
         ▼
      GitHub API
```

The backend coordinates the AI request and GitHub data retrieval while keeping protected credentials away from the browser.

## Core Source Locations

```text
src/
├── app/
│   ├── page.tsx
│   ├── chat/
│   ├── repositories/
│   └── api/
│       ├── chat/
│       └── github/
│
└── lib/
    ├── github.ts
    ├── gemini.ts
    └── providers/
```

This document describes the current DCloud architecture. It should be updated when significant architectural changes are introduced.
