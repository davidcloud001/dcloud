DCloud Development Guide

This document describes the development workflow, branching strategy, validation process, documentation practices, and release process used for DCloud.

DCloud is developed incrementally. Changes should be kept focused, reviewed carefully, validated locally, and integrated through the development branch before being released to "main".

---

Development Environment

DCloud is currently developed using:

- Next.js
- TypeScript
- Tailwind CSS
- Octokit
- OpenAI
- Google Gemini
- GitHub API
- npm
- Git

The primary local development environment is a Termux-based workflow.

Source files can be edited locally using tools such as Acode, while Git operations are performed from the terminal.

---

Branching Strategy

DCloud uses a simple development and release branch structure:

main
  ↑
devs
  ↑
feat/*

"main"

"main" is the stable release branch.

Changes should reach "main" only after they have been developed, reviewed, validated, and integrated through "devs".

"devs"

"devs" is the development and integration branch.

Normal feature work is developed from "devs" and merged back into "devs" through pull requests.

Feature Branches

Feature branches are created from "devs".

Examples:

feat/dashboard-improvements
feat/chat-provider-selection
feat/repository-context

Feature branches should normally represent one focused feature, fix, or architectural change.

---

Development Workflow

The normal DCloud development workflow is:

Define feature
      ↓
Review architecture
      ↓
Create feature branch from devs
      ↓
Build feature
      ↓
Test and validate
      ↓
Review changed files
      ↓
Update documentation when necessary
      ↓
Create Pull Request
      ↓
Merge into devs
      ↓
Validate integrated project
      ↓
Create Pull Request from devs to main
      ↓
Release

The goal is to keep each change understandable and independently reviewable.

---

Starting a New Feature

Before beginning a new feature:

1. Make sure the local repository is up to date.
2. Confirm that you are working from "devs".
3. Review the existing architecture.
4. Determine which files and systems the feature will affect.
5. Create a focused feature branch.

Example:

git switch devs
git pull origin devs
git switch -c feat/example-feature

Do not begin substantial feature work directly on "main".

---

Building Features

During implementation:

- Keep changes focused on the intended feature.
- Avoid unrelated refactoring.
- Follow the existing project structure.
- Keep server-side credentials on the server.
- Avoid hardcoding DCloud to a single repository when the feature should work at the GitHub account level.
- Keep provider-specific AI logic inside the provider layer.
- Preserve the current read-only GitHub capability boundary unless write functionality has been deliberately designed and approved.
- Review generated files before including them in a commit.

---

Local Development

Install dependencies:

npm install

Start the development server:

npm run dev

The application can then be tested locally in a browser using the local development address provided by Next.js.

---

Validation

Before creating a pull request, run the project's validation commands.

Lint

npm run lint

Production Build

npm run build -- --webpack

Both commands should complete successfully before a feature is considered ready for integration.

If a generated file changes during development or a build, review the change before deciding whether it belongs in the commit.

---

Reviewing Changes Before Commit

Before staging changes, inspect the repository state:

git status

Review the actual changes:

git diff

If the changes are correct, stage only the files that belong to the feature.

For example:

git add path/to/file

Then review the staged changes:

git diff --cached

This step is important because it provides a final opportunity to catch:

- Unrelated changes
- Accidental files
- Generated files
- Debug code
- Temporary files
- Incorrect documentation
- Secrets or credentials

---

Git Commit Workflow

After reviewing the staged changes, create a focused commit:

git commit -m "describe the change"

Then push the feature branch:

git push -u origin <feature-branch>

For an existing tracking branch, the shorter form can be used:

git push

Commit messages should clearly describe the purpose of the change.

---

Pull Requests

Normal feature pull requests should target:

devs

The general flow is:

feat/*
   ↓
Pull Request
   ↓
devs

After integration into "devs", the combined project should be validated before preparing a release.

---

Release Workflow

The release flow is:

devs
  ↓
Review integrated changes
  ↓
Run validation
  ↓
Test the integrated project
  ↓
Pull Request
  ↓
main

"main" should represent a stable version of DCloud rather than an active feature-development branch.

---

Documentation

DCloud currently uses the following primary documentation files:

"README.md"

The README provides a concise overview of DCloud, its current capabilities, technology stack, development basics, and links to detailed documentation.

"docs/ROADMAP.md"

The roadmap describes:

- Completed development phases
- Current capabilities
- Current development focus
- Future development directions
- Capability boundaries

"docs/ARCHITECTURE.md"

The architecture document describes:

- Frontend structure
- Backend API structure
- GitHub integration
- AI provider architecture
- Repository context
- Request flow
- Security and credential boundaries
- Current read-only architecture

"docs/DEVELOPMENT.md"

This document describes:

- Branching
- Development workflow
- Local development
- Validation
- Git workflow
- Pull requests
- Releases
- Documentation practices

Documentation should be updated when a significant architectural, workflow, or capability change is introduced.

---

Development Principles

DCloud development follows several core principles.

Incremental Development

Build and validate DCloud in manageable stages rather than introducing large unrelated changes at once.

Architecture Before Expansion

Before adding a major capability, review how it fits into the existing architecture.

Account-Level Design

DCloud should operate at the GitHub account level where appropriate.

The dashboard should not be permanently hardcoded around the "dcloud" repository.

Repository-specific functionality should use the currently selected repository as context.

Server-Side Credentials

GitHub and AI provider credentials must remain on the server.

Sensitive environment variables should not be exposed to the browser.

Read-Only Until Deliberately Expanded

The current GitHub integration is intentionally read-only.

Future write capabilities should be introduced only after their architecture, permissions, validation, and safety requirements have been deliberately designed.

Provider Separation

AI provider-specific implementation should remain separated through the provider architecture.

This allows DCloud to support multiple AI providers without coupling the entire chat system to one provider.

Small, Reviewable Changes

Prefer focused changes that can be understood, tested, reviewed, and reverted independently.

Documentation Synchronization

Documentation should describe the actual state of the project.

Do not document planned functionality as though it is already implemented.

---

Change Management Checklist

Before merging a feature, review the following:

- [ ] The change is on the correct feature branch.
- [ ] The feature was developed from "devs".
- [ ] Only intended files were modified.
- [ ] No secrets or credentials were added.
- [ ] No unrelated generated files were committed.
- [ ] "npm run lint" passes.
- [ ] "npm run build -- --webpack" passes.
- [ ] The feature was manually tested where appropriate.
- [ ] Documentation was updated if necessary.
- [ ] The staged diff was reviewed.
- [ ] The commit represents one focused change.
- [ ] The pull request targets "devs".

---

Current Development Model

The current DCloud development model can be summarized as:

main
  │
  │  stable releases
  │
devs
  │
  │  integration
  │
feat/*
  │
  └── focused feature development

This structure keeps active development separated from stable releases while allowing features to be developed and reviewed independently.
