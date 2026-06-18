# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**Nova** is the main web presence and application for Power Company SARL. This document provides essential context for AI assistants to work productively in this repository.

## Getting Started

### Initial Setup

```bash
git clone https://github.com/powercompanysarl-dotcom/nova.git
cd nova
```

After cloning, install dependencies and verify the environment is set up correctly. Refer to the project-specific setup sections below.

## Development Workflow

### Branch Strategy

- **main**: Production-ready code. Never push directly; use pull requests.
- **develop** or **dev**: Integration branch for features. Base PRs here for release candidates.
- **Feature branches**: Create from develop with prefix `feature/`, `fix/`, or `refactor/`.
- **Documentation branches**: Use prefix `docs/` for documentation-only changes.

When working on features, always:
1. Fetch latest: `git fetch origin`
2. Create a branch from the appropriate base
3. Commit with clear, descriptive messages
4. Push to your branch and create a PR for review

### Code Review Expectations

- PRs should include a clear description of changes and the problem they solve
- Link related issues if applicable
- Ensure CI passes before merge
- At least one approval before merging to main

## Project Structure

The project structure will evolve as development progresses. When examining the codebase:

1. **Configuration files** at the root level typically indicate the tech stack (package.json, tsconfig.json, Dockerfile, etc.)
2. **Source code** is usually organized by feature or layer (components, services, utils, etc.)
3. **Tests** are typically colocated with source files or in a separate test directory
4. **Documentation** is usually in README files and inline comments for complex logic

## Technology Stack

_To be determined as development progresses. Update this section once the tech stack is chosen._

Common choices for web projects:
- **Frontend**: React, Vue, Angular, or vanilla JS
- **Backend**: Node.js (Express, Nest.js), Python (Django, FastAPI), or other
- **Database**: PostgreSQL, MongoDB, or managed services
- **Infrastructure**: Docker, Kubernetes, serverless platforms

## Common Development Tasks

_This section will be populated as the codebase develops. Include:_

- How to run the development server
- How to run tests (all, single test, with coverage)
- How to lint and format code
- How to build for production
- How to run database migrations (if applicable)
- How to add new features or components

## Coding Standards

### General Principles

- **Clarity over cleverness**: Write code that's easy to understand and maintain
- **DRY (Don't Repeat Yourself)**: Extract shared logic into reusable utilities
- **Single Responsibility**: Each function/component should have one clear purpose
- **Testing**: Write tests for business logic and critical paths

### Code Style

- Follow the existing code style in the repository
- Use a linter and formatter (ESLint, Prettier, Black, etc.) if configured
- Keep functions small and focused
- Add comments only when the "why" is non-obvious

### Type Safety (if applicable)

- Use TypeScript if the project is configured with it
- Leverage type inference where possible
- Avoid `any` types; use `unknown` if necessary with proper type guards

## Git Workflow Best Practices

### Commits

- Make commits logical and focused (one feature/fix per commit)
- Write descriptive commit messages in present tense: "Add user authentication" not "Added user authentication"
- Prefix commit messages with type: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`

Example:
```
feat: add email notification system
fix: resolve race condition in cache invalidation
docs: update API documentation
```

### Pushing Changes

- Always push to feature branches first
- Create a pull request for review before merging
- Use `git push -u origin <branch-name>` for new branches

## Performance Considerations

_Update this section as the codebase matures._

- Monitor bundle size for frontend applications
- Profile database queries in backend services
- Cache appropriately without creating stale data issues
- Use lazy loading for heavy components

## Security Notes

- Never commit secrets, API keys, or credentials
- Use environment variables for configuration
- Validate and sanitize user input
- Keep dependencies up to date; monitor for vulnerabilities
- Review third-party dependencies before adding

## Troubleshooting

### Common Issues

_This section will be populated as common problems are encountered._

If you encounter issues:
1. Check if tests pass: `npm test` (or equivalent)
2. Verify all dependencies are installed
3. Clear cache if using a package manager: `npm cache clean --force` or equivalent
4. Check recent commits for breaking changes
5. Consult the project's issue tracker for known problems

## Dependencies and Versions

_Update as the project develops._

Key dependencies and minimum versions (when applicable):
- Node.js: vX.X+ (if Node-based)
- Python: 3.X+ (if Python-based)
- Other critical dependencies with version constraints

## Documentation

- Keep README files at the root and in major directories
- Document public APIs and complex algorithms
- Update docs when changing behavior
- Include examples in comments for non-obvious patterns

## Deployment

_To be documented once deployment pipeline is established._

## Additional Resources

- **Repository**: https://github.com/powercompanysarl-dotcom/nova
- **Issues**: Check the GitHub Issues tab for context on bugs and features
- **PRs**: Review existing pull requests for patterns and standards

---

**Last Updated**: 2026-06-18

This document should be updated as the codebase develops and patterns emerge. Prioritize keeping it aligned with actual development practices in the repository.
