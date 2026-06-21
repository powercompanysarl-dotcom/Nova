# CLAUDE.md

This file provides comprehensive guidance to Claude Code and AI assistants when working on the Nova repository—Power Company SARL's main web presence and application platform.

## Project Overview

**Nova** is Power Company SARL's central web application serving as the company's main digital presence. This is an early-stage project with a flexible tech stack, prioritizing rapid iteration and clear architectural patterns.

- **Owner**: Power Company SARL
- **Repository**: https://github.com/powercompanysarl-dotcom/nova
- **Contact**: powercompanysarl@gmail.com

## Development Workflow

### Branch Strategy

Strict branch discipline ensures code quality and production stability:

- **main**: Production-ready code. **Never commit directly**. All changes must go through PRs with CI passing and at least one approval.
- **develop** or **dev**: Integration branch for features. Use this as the base for most feature PRs.
- **Feature branches**: Create from `develop` with clear prefixes:
  - `feature/<description>` — new features
  - `fix/<description>` — bug fixes
  - `refactor/<description>` — code structure improvements
  - `docs/<description>` — documentation-only changes
  - `claude/<description>-<session-id>` — Claude Code branches (auto-generated)

### Development Workflow

1. **Fetch latest**: `git fetch origin` before creating a branch
2. **Create feature branch**: `git checkout -b feature/your-feature develop`
3. **Make changes**: Commit logically with clear messages (see Commits section)
4. **Push**: `git push -u origin <branch-name>`
5. **Create PR**: Open a pull request against `develop` (or `main` for hotfixes)
6. **CI & Review**: Ensure CI passes and at least one approval before merge
7. **Merge**: Use squash or rebase depending on commit history; delete branch after merge

### Code Review Expectations

- PRs must include a clear title (under 70 characters) and descriptive body
- Description should explain **why** changes were made, not just **what** changed
- Link related GitHub issues or discussions
- Ensure all CI checks pass (tests, linting, type checking)
- Address blocking review comments before merging
- Keep PRs focused and reasonably sized (prefer smaller, focused PRs over large monolithic ones)

## Commits

### Message Format

Write clear, descriptive commit messages in **present tense**. Use conventional commit prefixes to categorize changes:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` — new feature or enhancement
- `fix:` — bug fix
- `docs:` — documentation changes (README, comments, guides)
- `refactor:` — code restructuring without behavior change
- `test:` — test additions or modifications
- `chore:` — build, CI, dependency updates, or non-functional changes
- `perf:` — performance improvements
- `style:` — formatting, spacing, naming (not behavior)

**Examples:**
```
feat: add user authentication via OAuth2

Integrate Auth0 for secure user authentication. Add login/logout flows
and user profile management. Closes #42.

feat(api): add rate limiting to REST endpoints

refactor(components): extract shared button styles

fix: resolve memory leak in WebSocket connection handler

docs: update API documentation for new endpoints
```

**Guidelines:**
- First line is the subject (50 chars max)
- Blank line after subject
- Body wraps at 72 characters
- Explain the **why**, not the **what** (code shows what it does)
- Reference issues: "Closes #123" or "Fixes #456"
- One logical change per commit

## Project Structure

The Nova repository follows a modular structure organized by feature and responsibility:

```
nova/
├── .git/                 # Git configuration
├── .github/              # GitHub workflows, templates, issue templates
│   ├── workflows/        # CI/CD pipelines
│   └── ISSUE_TEMPLATE/   # Issue templates
├── CLAUDE.md             # This file — guidance for AI assistants
├── README.md             # Project overview and setup instructions
├── CONTRIBUTING.md       # Contribution guidelines
├── LICENSE               # License (if applicable)
├── .gitignore            # Git ignore rules (no secrets, deps, build artifacts)
│
├── [tech-stack-specific directories — see Tech Stack section]
└── docs/                 # Additional documentation
    ├── API.md            # API documentation
    ├── ARCHITECTURE.md   # System architecture and design decisions
    ├── SETUP.md          # Detailed setup and environment configuration
    └── DEPLOYMENT.md     # Deployment procedures and runbooks
```

### Tech Stack Structure (Placeholder)

The actual directory structure depends on the chosen tech stack. Common patterns:

**If Node.js/React Frontend:**
```
frontend/
├── src/
│   ├── components/       # React components (organized by feature)
│   ├── pages/            # Page-level components (if using routing)
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React Context providers
│   ├── services/         # API clients and service layer
│   ├── styles/           # Global styles (CSS/SCSS)
│   ├── utils/            # Utility functions
│   └── App.tsx
├── public/               # Static assets
├── tests/                # Test files (colocated or separate)
├── package.json
├── tsconfig.json
├── tailwind.config.js    # If using Tailwind CSS
└── vite.config.ts        # If using Vite (or webpack.config.js for Webpack)
```

**If Node.js/Express Backend:**
```
backend/
├── src/
│   ├── routes/           # API endpoints
│   ├── controllers/       # Route handlers
│   ├── models/           # Data models
│   ├── middleware/       # Express middleware
│   ├── services/         # Business logic
│   ├── utils/            # Utilities and helpers
│   ├── config/           # Configuration files
│   └── index.ts
├── tests/
├── migrations/           # Database migrations (if applicable)
├── package.json
├── tsconfig.json
├── .env.example          # Environment variable template
└── Dockerfile
```

**If Python Backend:**
```
backend/
├── app/
│   ├── main.py           # Application entry point
│   ├── routes/           # API endpoints
│   ├── models/           # Data models
│   ├── schemas/          # Pydantic schemas
│   ├── services/         # Business logic
│   └── config.py         # Configuration
├── tests/
├── migrations/           # Database migrations
├── requirements.txt      # Python dependencies
├── pyproject.toml        # Modern Python project config
├── Dockerfile
└── .env.example
```

## Technology Stack

**Status: To be determined**

The actual tech stack will be chosen based on project requirements. Common modern choices:

### Frontend
- **React** (TypeScript) — component-based UI framework
- **Vue.js** — lightweight reactive framework
- **Next.js** — React framework with server-side rendering and API routes
- **Svelte** — compiler-based framework

### Backend
- **Node.js + Express** — JavaScript runtime with minimal web framework
- **Node.js + NestJS** — opinionated Node framework with TypeScript support
- **Python + FastAPI** — modern async Python framework
- **Python + Django** — batteries-included Python framework
- **Go** — compiled language for high-performance APIs

### Database
- **PostgreSQL** — robust, open-source relational database (recommended)
- **MongoDB** — NoSQL document database
- **Supabase** — managed PostgreSQL with auth and real-time features
- **Firebase** — managed backend platform (auth, database, functions)

### Infrastructure & Deployment
- **Docker** — containerization
- **GitHub Actions** — CI/CD pipelines (free with GitHub)
- **Vercel** — optimized for Next.js and frontend deployment
- **Heroku** — simple app deployment (legacy, moving away)
- **AWS** — comprehensive cloud services
- **DigitalOcean** — simple VPS or App Platform
- **Fly.io** — modern container deployment platform

### Development Tools (Tech-Agnostic)
- **Git** — version control
- **GitHub** — repository hosting and collaboration
- **npm/yarn/pnpm** — JavaScript package managers (if Node.js)
- **ESLint** — JavaScript linting
- **Prettier** — code formatting (JavaScript/TypeScript/CSS/JSON/Markdown)
- **black** — Python code formatter (if Python)
- **pytest** — Python testing framework (if Python)
- **Jest** — JavaScript testing framework (if Node.js)
- **Vitest** — modern JavaScript testing framework (if Node.js + Vite)

**Once the stack is chosen, update this section with specific versions, configurations, and setup instructions.**

## Coding Standards

### General Principles

These principles apply regardless of tech stack:

1. **Clarity over cleverness**: Write code that's easy to understand. Future maintainers (including future you) should be able to grasp intent quickly.
2. **DRY (Don't Repeat Yourself)**: Extract shared logic into reusable utilities, components, or functions. But don't prematurely abstract—three instances is a better threshold than two.
3. **Single Responsibility**: Each function, class, or component should have one clear purpose.
4. **Fail safely**: Handle errors gracefully. Validate at system boundaries (user input, external APIs). Trust internal code.
5. **Type safety**: Use type systems (TypeScript, Python type hints) to catch errors early.
6. **Testing**: Write tests for business logic and critical paths. Prioritize integration and end-to-end tests over unit tests.

### Code Style

- **Follow existing patterns**: Match the style and structure of surrounding code.
- **Use formatters**: Prettier (JavaScript/TypeScript) and black (Python) enforce consistency. No bikeshedding.
- **Keep functions small**: Functions longer than a screen should be reconsidered. Aim for functions that do one thing.
- **Naming matters**: Use clear, descriptive names (`fetchUserById` not `getU`). Avoid abbreviations.
- **Comments**: Add comments only when the **why** is non-obvious. Well-named code is self-documenting.
  - Don't explain what the code does (`// increment i` on `i++`).
  - Explain hidden assumptions and workarounds.
  - Reference related issues or tickets when needed.

### Type Safety

- **TypeScript (JavaScript projects)**:
  - Always use TypeScript. Type inference is powerful; use it.
  - Avoid `any` types. Use `unknown` with type guards if you must.
  - Leverage strict mode (`"strict": true` in tsconfig.json).
  - Use discriminated unions for complex state.

- **Python (Python projects)**:
  - Use type hints for all public functions and class methods.
  - Use `pyright` or `mypy` for type checking.
  - Leverage dataclasses or Pydantic for structured data.

### Testing

- **Unit tests**: Test individual functions and components in isolation.
- **Integration tests**: Test multiple components working together.
- **End-to-end tests**: Test full user workflows (login, form submission, etc.).
- **Coverage**: Aim for 80%+ coverage on critical paths. Don't obsess over 100%.
- **Naming**: Test names should describe the behavior (`test_should_show_error_when_email_is_invalid` not `test_email`).

### Security

- **Never commit secrets**: API keys, passwords, database credentials belong in `.env` files (template in `.env.example`).
- **Validate input**: Sanitize user input, validate email/URLs, escape output (especially in HTML contexts).
- **Use HTTPS**: Always encrypt in transit.
- **Dependency audits**: Regularly run `npm audit` or `pip audit` and update vulnerabilities.
- **Authentication**: Use established libraries (Auth0, Clerk, NextAuth, etc.) rather than rolling your own.
- **Authorization**: Verify user permissions for all protected operations.
- **SQL injection prevention**: Use parameterized queries or ORMs. Never concatenate user input into queries.

## Common Development Tasks

### Setup & Installation

**General process:**
1. Clone the repository: `git clone https://github.com/powercompanysarl-dotcom/nova.git`
2. Navigate to the project: `cd nova`
3. Follow setup instructions in `SETUP.md` or `README.md` (to be created)
4. Install dependencies: `npm install` (Node.js) or `pip install -r requirements.txt` (Python)
5. Set up environment: Copy `.env.example` to `.env.local` and fill in required values
6. Verify setup: Run tests and the dev server

**Once the tech stack is chosen, add specific setup instructions.**

### Development Server

```bash
# JavaScript/Node.js (typical)
npm run dev

# Python (typical)
python -m uvicorn app.main:app --reload
```

### Running Tests

```bash
# Run all tests
npm test                    # JavaScript
pytest                      # Python

# Run specific test
npm test -- component.test  # JavaScript
pytest tests/test_model.py  # Python

# With coverage
npm test -- --coverage      # JavaScript
pytest --cov               # Python
```

### Linting & Formatting

```bash
# Format code
npm run format              # JavaScript (Prettier)
black src/                  # Python

# Lint code
npm run lint                # JavaScript (ESLint)
pylint src/                 # Python

# Fix linting issues automatically
npm run lint -- --fix       # JavaScript
black src/                  # Python (auto-fixes)
```

### Building for Production

```bash
# JavaScript
npm run build
npm run preview            # Test production build locally

# Python
pip install -r requirements.txt
gunicorn app.main:app      # Or appropriate ASGI server
```

### Database Migrations (if applicable)

```bash
# Create a new migration
npm run migrate:create migration_name

# Run migrations
npm run migrate:up

# Rollback
npm run migrate:down
```

### Adding Dependencies

```bash
# Node.js
npm install package-name           # Production
npm install --save-dev package-name # Development

# Python
pip install package-name
pip freeze > requirements.txt  # Update lock file
```

## Performance Considerations

### Frontend
- **Bundle size**: Monitor and optimize. Use tree-shaking and code splitting.
- **Lazy loading**: Load components and routes on-demand.
- **Image optimization**: Use next-gen formats (WebP), compress, and lazy-load.
- **Caching**: Cache static assets. Use appropriate cache headers.

### Backend
- **Database queries**: Avoid N+1 queries. Use eager loading (JOIN, INCLUDE) when needed.
- **Indexes**: Index frequently-queried columns.
- **Connection pooling**: Reuse database connections.
- **API response time**: Monitor and optimize slow endpoints. Target < 200ms.

### General
- **Monitoring**: Set up error tracking (Sentry) and analytics early.
- **Profiling**: Use browser DevTools (frontend) and profilers (backend) to identify bottlenecks.

## Environment Configuration

### Environment Variables

Use environment variables for configuration that varies by environment. Never hardcode secrets or environment-specific values.

**Template (`.env.example`):**
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nova_dev

# Authentication
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=xxx
AUTH0_CLIENT_SECRET=xxx

# API
API_BASE_URL=http://localhost:3000
API_PORT=3000

# Feature flags
FEATURE_NEW_DASHBOARD=false

# Development
DEBUG=false
LOG_LEVEL=info
```

**Loading in code:**
- **JavaScript**: Use `process.env` or libraries like `dotenv`.
- **Python**: Use `os.getenv()` or `python-dotenv`.

## Troubleshooting

### General Steps

1. **Check logs**: Most issues appear in error logs or console output.
2. **Run tests**: `npm test` or `pytest` — tests often reveal the root cause.
3. **Clear cache**: `npm cache clean --force` or delete `node_modules/` and reinstall.
4. **Check Git status**: `git status` — ensure no uncommitted changes interfere.
5. **Review recent commits**: `git log --oneline -10` — look for breaking changes.
6. **Check dependencies**: Run `npm audit` or `pip audit` for known vulnerabilities.

### Common Issues (To Be Populated)

As the project develops, document specific issues and solutions:

```markdown
**Issue**: X error when running tests
**Solution**: Y workaround or fix

**Issue**: Z build failure
**Solution**: W steps to resolve
```

## Documentation

Maintain documentation as the codebase grows:

- **README.md**: Project overview, quick start, and key links
- **SETUP.md**: Detailed setup and environment configuration
- **API.md**: API endpoints, request/response examples, error codes
- **ARCHITECTURE.md**: System design, data flow, key decisions
- **DEPLOYMENT.md**: How to deploy to staging/production
- **Inline comments**: Explain complex logic, workarounds, and non-obvious patterns

## Deployment

**Status: To be documented once deployment infrastructure is established.**

When ready, document:
- Deployment targets (staging, production)
- Deployment process and frequency
- Rollback procedures
- Monitoring and alerting
- Incident response

## Contributing

Contributions should follow this workflow:

1. **Pick an issue** or create one for your planned work
2. **Create a feature branch** following the branch naming convention
3. **Make small, focused commits** with clear messages
4. **Push to your branch** and create a PR against `develop`
5. **Respond to review comments** promptly
6. **Ensure CI passes** before merge
7. **Merge once approved** and delete your branch

See **Code Review Expectations** above for PR standards.

## Additional Resources

- **Repository**: https://github.com/powercompanysarl-dotcom/nova
- **Issues**: GitHub Issues tab for bugs, features, and discussions
- **Pull Requests**: Review open and merged PRs for patterns and conventions
- **Contact**: powercompanysarl@gmail.com for questions about project direction

## Document History

| Date       | Version | Changes                                           |
|------------|---------|---------------------------------------------------|
| 2026-06-18 | 1.0     | Initial comprehensive CLAUDE.md creation          |

---

**This document should be updated regularly as the codebase develops.** Prioritize keeping it aligned with actual project practices. When in doubt, optimize for clarity and developer experience.

**Last Updated**: 2026-06-18
