# Contributing to QR Gate Access System

## Development Workflow

1. **Branching**: All new features should be developed in separate branches (e.g., `feature/your-feature-name`).
2. **Coding Standards**: Follow the existing ESLint and Prettier configurations.
3. **Database**: Use `npx prisma db push` to sync changes to the local SQLite database.
4. **Testing**: Run `npm run test-logic` to verify core business logic before committing.

## Branch Naming Convention

- `feature/*`: New features
- `fix/*`: Bug fixes
- `refactor/*`: Code improvements
- `upload/*`: Initial code uploads or migrations

## Deployment

Currently handled via local scripts or direct Vercel integration.
