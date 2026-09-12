DCloud Architecture

DCloud is a Next.js web application that combines a web dashboard, server-side GitHub integration, and an AI assistant.

The architecture separates the user interface, server-side API routes, GitHub integration, AI provider implementations, and external services.

Architecture Overview

DCloud
│
├── Frontend
│   ├── Dashboard
│   ├── Repositories
│   ├── Repository-specific views
│   └── Chat
│
├── Backend API
│   ├── Chat API
│   └── GitHub API routes
│
├── GitHub Integration
│   └── Octokit
│
├── AI Provider Layer
│   ├── OpenAI
│   └── Google Gemini
│
└── External Services
    ├── GitHub API
    ├── OpenAI API
    └── Google Gemini API

Frontend

The frontend is implemented using the Next.js App Router.

Main application areas include:

- Dashboard
- Repositories
- Repository-specific views
- Chat

The frontend is responsible for:

- Displaying GitHub information.
- Allowing repository selection.
- Displaying repository-specific information.
- Providing the AI chat interface.
- Allowing AI provider and model selection.

The frontend does not directly handle protected GitHub or AI provider credentials.

Repository Context

DCloud is designed as an account-level GitHub dashboard rather than an application hardcoded to a single repository.

The general repository flow is:

GitHub account
      │
      ▼
Repository list
      │
      ▼
User selects repository
      │
      ▼
Active repository context
      │
      ├── Repository metadata
      ├── Branches
      ├── Issues
      ├── Pull requests
      ├── Actions
      └── AI-assisted repository queries

Repository-specific operations use the selected repository as their context.

This allows DCloud to work with repositories belonging to the configured GitHub account rather than limiting the dashboard to the DCloud repository itself.

Backend API

DCloud uses Next.js server-side API routes for requests that require protected credentials or communication with external services.

The backend currently includes:

- "/api/chat" — handles AI assistant requests.
- "/api/github/repositories" — retrieves GitHub repositories.
- "/api/github/branches" — retrieves repository branches.
- "/api/github/issues" — retrieves repository issues.
- "/api/github/pull-requests" — retrieves repository pull requests.
- "/api/github/workflow-runs" — retrieves GitHub Actions workflow runs.

The API layer performs server-side validation and coordinates communication with external services.

GitHub Integration

GitHub integration is implemented through Octokit.

The main GitHub integration is located at:

src/lib/github.ts

It provides server-side functionality for retrieving:

- Repositories
- Repository metadata
- Branches
- Issues
- Pull requests
- GitHub Actions workflow runs
- Repository file contents where supported by the application

GitHub credentials are stored in environment variables and remain on the server.

GitHub Capability Boundary

The current GitHub integration is read-only.

DCloud currently retrieves GitHub information but does not use the GitHub integration to modify repositories.

AI Assistant

The Chat interface communicates with:

/api/chat

The chat backend:

1. Receives the user's chat request.
2. Validates the requested provider and model.
3. Maintains the relevant repository context.
4. Communicates with the selected AI provider.
5. Provides supported read-only GitHub tools to the assistant.
6. Returns the assistant response to the Chat interface.

The assistant can use read-only GitHub tools to retrieve information relevant to the user's request.

Read-Only GitHub Tools

The AI assistant currently has access to read-only GitHub capabilities including:

- List repositories.
- Get repository metadata.
- List branches.
- List issues.
- List pull requests.
- List GitHub Actions workflow runs.
- Get repository file contents.

The assistant does not currently perform GitHub write operations.

This boundary is intentional and should remain explicit when new AI tools are introduced.

AI Provider Layer

DCloud separates provider-specific AI implementations from the main chat API.

The provider abstraction is located in:

src/lib/providers/

Current provider-layer files include:

src/lib/providers/
├── types.ts
├── index.ts
├── openai.ts
└── gemini.ts

The provider layer allows the Chat system to support multiple AI providers while keeping provider-specific implementation details separate from the main chat API.

Current providers are:

- OpenAI
- Google Gemini

The Chat interface supports provider and model selection.

Gemini Integration

DCloud also contains a server-side Gemini API helper:

src/lib/Gemini.ts

This helper handles low-level communication with the Google Gemini API and keeps the Gemini API key server-side.

The provider abstraction remains responsible for integrating Gemini into the broader AI provider system.

AI Provider and Model Flow

The general AI selection flow is:

Chat UI
   │
   ├── Selected provider
   │
   └── Selected model
          │
          ▼
       /api/chat
          │
          ▼
    Provider abstraction
          │
      ┌───┴────┐
      ▼        ▼
   OpenAI    Gemini

Provider-specific implementation details are kept outside the main Chat UI.

Request Flow

A typical AI-assisted GitHub request follows this flow:

User
 │
 ▼
DCloud Chat UI
 │
 ▼
/api/chat
 │
 ├── Validate request
 │
 ├── Repository context
 │
 ├── AI Provider Layer
 │      ├── OpenAI
 │      └── Google Gemini
 │
 └── Read-only GitHub Tools
          │
          ▼
       GitHub Integration
          │
          ▼
        Octokit
          │
          ▼
      GitHub API

The backend coordinates the AI request and GitHub data retrieval while keeping protected credentials away from the browser.

Security and Credential Boundary

Protected credentials are intended to remain server-side.

Browser
   │
   │ User requests
   ▼
DCloud Server
   │
   ├── GitHub credentials
   ├── OpenAI credentials
   └── Gemini credentials
   │
   ▼
External APIs

Sensitive API keys and tokens must not be exposed through frontend code.

Environment variables are used for protected credentials and configuration.

The example configuration is stored in:

.env.example

Current Read-Only Architecture

The current architecture intentionally separates reading GitHub information from future write capabilities.

                    DCloud
                      │
              ┌───────┴────────┐
              │                │
          Dashboard           Chat
              │                │
              │             /api/chat
              │                │
              │        AI Provider Layer
              │          /          \
              │      OpenAI        Gemini
              │                │
              └───────┬────────┘
                      │
              Read-only GitHub
                    tools
                      │
                   Octokit
                      │
                 GitHub API

GitHub write operations are outside the current architecture boundary.

Core Source Locations

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
    ├── Gemini.ts
    └── providers/
        ├── types.ts
        ├── index.ts
        ├── openai.ts
        └── gemini.ts

The exact source structure may evolve as the application grows.

This document describes the current DCloud architecture and should be updated when significant architectural changes are introduced.
