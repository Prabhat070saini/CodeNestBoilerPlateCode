<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
</p>

# NestJS Boilerplate

A production-oriented NestJS + TypeScript starter for backend APIs. It standardizes authentication, configuration, database access, caching, logging, and HTTP cross-cutting concerns so new services do not re-implement the same foundation.

HTTP is served with **Fastify** (`@nestjs/platform-fastify`), not Express.

---

## Overview

The project is a modular NestJS application with:

- URI versioning under the global prefix `/api` (feature routes are `/api/v1/...`)
- Joi-validated environment configuration
- PostgreSQL via TypeORM (`dbo` schema)
- Redis as a pluggable cache provider
- JWT auth with httpOnly cookies, OTP, and Google OAuth
- API key guard on all routes except those marked public
- Winston logging with request tracing (`x-request-id`)
- Swagger at `/docs`

RabbitMQ is implemented under `src/core/queue` but is **not** registered in `CoreModule` yet. AWS, email, and OTP values are required by the env schema even when some of those integrations are not fully wired.

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | NestJS 10 |
| Language | TypeScript |
| HTTP adapter | Fastify |
| Database | PostgreSQL |
| ORM | TypeORM + typeorm-extension |
| Cache | Redis (`ioredis`) |
| Queue (optional) | RabbitMQ (`amqplib`) |
| Auth | JWT, Passport Google OAuth 2.0, bcrypt |
| Validation | `class-validator`, `class-transformer`, Joi |
| Docs | Swagger (`/docs`) |
| Logging | Winston + custom logger |
| Tooling | ESLint, Prettier, Husky, lint-staged, Jest |

---

## Features

- **API key gate**: global `ValidateApiKeyGuard` requires header `x-api-key` unless the handler is decorated with `@IsPublic()`
- **Auth**: sign-up, sign-in (sets `access_token` / `refresh_token` cookies), OTP send/verify, refresh token, Google OAuth
- **RBAC**: `@Role()` metadata + `PermissionGuard` (example role code `MST002` on user lookup)
- **Session cache**: access tokens can be checked against Redis when `USE_REDIS=true`
- **Users & books**: sample feature modules with TypeORM entities, ULIDs, and pagination DTOs
- **Migrations and seeding**: generate/run migrations; seeders create the `dbo` schema
- **HTTP hardening**: Helmet, CORS (credentials), cookies, cache-control, allowlisted request headers
- **Tracing**: incoming `x-request-id` is reused or generated and echoed on the response
- **Global validation pipe**: whitelist, transform, forbid unknown properties
- **Git hooks**: Husky runs lint-staged (ESLint + Prettier) on commit

---

## Prerequisites

## Requirements

- Node.js >= 24 and < 27
- npm >= 10

### Supported Node.js versions

- Node.js 24.x (Maintenance LTS)
- Node.js 26.x (Active LTS)- npm
- PostgreSQL
- Redis (required when `USE_REDIS=true`, which is the default)
- RabbitMQ only if you enable `QueueModule` in `CoreModule`

---

## Project structure

```text
src
├── apis                     # Feature modules
│   ├── auth                 # Sign-up, sign-in, OTP, refresh, Google OAuth
│   ├── book                 # Book listing and lookup
│   └── user                 # User lookup
├── bootstrap                # App prefix/versioning/pipes and Swagger
├── common
│   ├── constants            # Exception codes, cookies, enums
│   ├── decorators           # @IsPublic, @Role, ULID, Swagger helpers
│   ├── dto                  # Shared pagination / params
│   ├── guards               # API key, JWT cookie auth, permissions
│   ├── Interceptor          # Fastify adapter, CORS, Helmet, hooks
│   ├── lib                  # Logger, tracing, hashing, crypto, HTTP client
│   ├── repository           # Shared TypeORM repositories
│   ├── token                # Access / refresh token service
│   └── utils
├── config                   # dotenv load, Joi schema, typed config
├── core
│   ├── cache                # Redis cache provider
│   ├── database             # TypeORM DataSource, migrations, seeders
│   └── queue                # RabbitMQ provider (not mounted in CoreModule)
├── integrations             # External stubs (e.g. payments)
├── app.module.ts
└── main.ts
```

---

## Installation

```bash
git clone https://github.com/Prabhat070saini/CodeNestBoilerPlateCode.git
cd CodeNestBoilerPlateCode
npm install
npm run prepare
```

Create a `.env` file in the project root. Startup fails if Joi validation does not pass.

---

## Environment variables

All keys below are consumed by `src/config/schema.config.ts` unless noted. Token expiry values are **numbers of minutes**, not duration strings like `15m`.

```bash
# App
CORS_ORIGIN=http://localhost:3000
X_API_KEY=your-api-key
ENV_NAME=development
LOG_LEVEL=debug
SERVER_HOST=localhost
SERVER_PORT=3000
API_TOOL_ENABLED=true

# Database
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=example_db
DB_POOL_MIN=5
DB_POOL_MAX=20
DB_CONNECTION_TIMEOUT=10000
DB_LOGGING=false
DB_CONNECTION_IDLE_TIMEOUT=60000

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_CONNECTION_LIMIT=50
USE_REDIS=true
REDIS_RETRY_LIMIT=5
# REDIS_PASSWORD=

# RabbitMQ (schema-required; module not enabled in CoreModule)
RABBITMQ_URL=amqp://localhost
DEFAULT_RETRIES=3
DEFAULT_RETRY_DELAY_MS=5000
IS_DLQ=true

# JWT (expiry is minutes; the app converts to seconds)
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
ACCESS_TOKEN_EXP_IN_MIN=15
REFRESH_TOKEN_EXP_IN_MIN=10080

# AWS (schema-required; S3 client is not implemented in this tree)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name
SIGNED_URL_EXPIRE=3600

# Email (schema-required; SMTP sending is not implemented in this tree)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=465
EMAIL_USERNAME=example@example.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=example@example.com
EMAIL_PROVIDER=smtp

# OTP
OTP_CRYPTO_SECRET=your-otp-secret
OTP_TTL=300
COOL_DOWN_TTL=60
MAX_PER_HOUR=3
MAX_ATTEMPTS=3

# Google OAuth (read from process.env in GoogleStrategy; not in the Joi schema)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Notes:

- `API_TOOL_ENABLED=false` rejects requests whose headers are not in the allowlist (`x-api-key`, `authorization`, `x-request-id`, etc.).
- Google callback is currently `http://localhost:3000/api/v1/auth/google/callback`.
- `CORS_ORIGIN` is a comma-separated list.

---

## Database

Entities live in the TypeORM schema `dbo`. The seeder creates that schema if it is missing. Tables: `dbo.users`, `dbo.books`. Public IDs are ULIDs (`user_id`, `book_id`).

```bash
# Generate a new migration from entity changes
npm run migration:generate

# Apply migrations, then run seeders
npm run migration:run

# Revert the last migration
npm run migration:revert

# Seed only
npm run seed
```

These scripts build the project first and run TypeORM against `dist/core/database/migration_seeder_setup/data.source.js`.

---

## Running the app

```bash
npm run start          # nest start
npm run start:dev      # watch mode
npm run start:debug    # debug + watch
npm run start:prod     # node dist/main.js
npm run build
```

The process listens on `0.0.0.0` and `SERVER_PORT` (default `3000`).

- Health: `GET /api` (public; no API key)
- Swagger: `http://localhost:3000/docs`

---

## HTTP API

Unless a route is `@IsPublic()`, send:

```http
x-api-key: <X_API_KEY>
```


## Scripts

| Script | Purpose |
| --- | --- |
| `npm run start` / `start:dev` / `start:debug` / `start:prod` | Run the API |
| `npm run build` | Compile to `dist/` |
| `npm run lint` | ESLint with `--fix` |
| `npm run format` | Prettier |
| `npm run test` | Unit tests (Jest, `src/**/*.spec.ts`) |
| `npm run test:watch` | Jest watch |
| `npm run test:cov` | Coverage |
| `npm run test:e2e` | E2E tests (`test/`) |
| `npm run prepare` | Install Husky hooks |
| `npm run migration:generate` | Generate a TypeORM migration |
| `npm run migration:run` | Run migrations and seed |
| `npm run migration:revert` | Revert last migration |
| `npm run seed` | Run typeorm-extension seeders |

---

## Architecture notes

- **Fastify adapter** is created in `src/common/Interceptor/create-http-adapter.ts` (100 MB body limit, plugins, parsers).
- **Core** currently mounts `DatabaseModule` and Redis `CacheModule`. Uncomment and configure `QueueModule.forRoot(...)` in `src/core/core.module.ts` to enable RabbitMQ.
- **Guards**: API key is global; JWT cookie auth is `AuthnGuard`; roles are `PermissionGuard`.
- **Config** is loaded from `.env` in `src/config/validation.config.ts` and exposed as a typed object from `src/config/config.ts`.
- **Payments** (`src/integrations/payments`) is a stub for future integrations.

---

## Testing and quality

```bash
npm run test
npm run test:e2e
npm run lint
npm run format
```

Pre-commit hook: `.husky/pre-commit` runs `npx lint-staged`.

---

## License

MIT (`package.json`).

---

Built by [Prabhat Saini](https://github.com/Prabhat070saini)
