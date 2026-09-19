# Agent Guidelines & Engineering Standards

## 1. Environment & Configuration Sync
- **Root `.env.prod` is the Source of Truth**: Whenever configuration keys, third-party credentials, or environment variables are added or modified, update the root `.env.prod` immediately along with the respective sub-service `.env` files (`backend/.env`, `backend/.env.prod`, `backend/.env.example`, `backend/.env.prod.example`).
- **All Changes Propagated**: Never leave environment variables isolated in one subfolder. All environments must stay synchronized and properly documented.

## 2. No Hardcoding
- **Never Hardcode Secrets or Credentials**: API keys, DSNs, database URLs, JWT secrets, and AWS credentials must always be loaded through environment variables via configuration classes or `os.getenv` with standard fallbacks only when safe.
- **Dynamic Overrides**: Always respect runtime environment variable overrides over default or development values.

## 3. No Patches on Patches (Clean Code First)
- **Root Cause Resolution**: When fixing bugs or refactoring, fix the root cause cleanly. Never apply temporary workarounds, monkey patches, or stacked patches on top of existing broken code.
- **Architectural Integrity**: Maintain clean separation of concerns across layers (routes, services, core, database models, middleware).
- **Simplicity**: Write the simplest code that completely solves the problem. Use early returns, avoid nested conditionals/ternaries, and keep functions single-purpose.

## 4. File Structure & Quality Rules
- **File Length Limit**: Keep every file concise (under 200 lines). If a file exceeds this, break it down logically into modular components/services.
- **Strict Typing & Diagnostics**: Avoid `any` in TypeScript. Ensure Python code complies with strict typing and ruff/flake8 standards.
- **No Residual Debug Code**: Remove all temporary `console.log`, arbitrary `print()` statements, and one-off debug test routes before finalizing production releases.

## 5. Version Control & Automated Delivery
- **Commit & Push on Major Changes**: Whenever a major feature, architectural update, security improvement, or core third-party integration is completed and verified, create a clear semantic git commit and push the changes directly to the remote repository (`origin/main`).
