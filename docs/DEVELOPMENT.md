# DCloud Development Guide

This document describes the development workflow used to build, test, document, and integrate DCloud changes.

## Development Environment

DCloud is developed locally using:

- Termux for the development environment and Git commands.
- Acode for editing project files.
- Node.js and npm for project dependencies and scripts.
- Git and GitHub for version control and collaboration.

## Branching Strategy

DCloud uses three levels of branches:

```text
main
  ↑
body
  ↑
feat/*
```

### `main`

`main` is the stable release branch.

Changes are promoted to `main` from `body` after the work has been reviewed, validated, and approved for release.

### `body`

`body` is the development and integration branch.

Completed feature branches are merged into `body` before a release is considered.

### Feature Branches

New work is developed on feature branches created from `body`.

Examples:

```text
feat/docs
feat/new-feature
feat/provider-update
```

Feature branches should contain one focused piece of work whenever practical.

## Development Workflow

The general DCloud workflow is:

```text
Create feature branch
        ↓
Build feature
        ↓
Test and validate
        ↓
Document completed work
        ↓
Create Pull Request
        ↓
Merge into body
        ↓
Validate integrated project
        ↓
Release body to main
```

The documentation should describe what has actually been built rather than documenting unimplemented functionality as completed.

## Local Development

Install project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application can then be tested locally through the development server.

## Validation

Before integrating a feature, run the project validation commands:

```bash
npm run lint
```

and:

```bash
npm run build -- --webpack
```

Both commands should complete successfully before a feature is considered ready for integration.

Feature-specific functionality should also be tested manually in the local development environment when appropriate.

## Git Workflow

Check the current branch and working tree:

```bash
git status
```

Review changes before staging:

```bash
git diff
```

Stage intended changes:

```bash
git add <file>
```

Review staged changes:

```bash
git diff --cached
```

Create a commit describing the completed change:

```bash
git commit -m "type: description"
```

Push the feature branch:

```bash
git push -u origin <branch-name>
```

Pull Requests should target `body` for normal feature development.

## Documentation Workflow

Documentation is maintained alongside development.

The preferred workflow is:

```text
Build feature
     ↓
Understand and validate feature
     ↓
Document what was actually built
     ↓
Merge feature into body
```

Project-level documentation is updated as the architecture, development process, or project direction changes.

The main documentation files are:

```text
README.md
docs/
├── ROADMAP.md
├── ARCHITECTURE.md
└── DEVELOPMENT.md
```

## Release Workflow

When the work in `body` is considered ready for release:

```text
body
  ↓
Review and validate
  ↓
Pull Request
  ↓
main
```

The `main` branch represents the released state of DCloud.

## Change Management

Before committing or merging changes:

- Review the files that changed.
- Confirm that unrelated files were not modified.
- Run linting and the production build.
- Test the affected functionality locally.
- Update documentation when the change affects documented behavior or architecture.
- Keep commits and Pull Requests focused on the work being performed.

This workflow is intended to keep DCloud development incremental, understandable, and easy to maintain.