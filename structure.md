# Project Structure

In-depth folder and file map for **CodeNestBoilerPlateCode** — a NestJS 10 + TypeScript + Fastify boilerplate.

Routes are served under `/api/v1/...`. Swagger is at `/docs`.

---

## Root layout

```text
CodeNestBoilerPlateCode/
├── .husky/                  # Git hooks (Husky)
│   └── pre-commit           # Runs lint-staged before commit
├── src/                     # Application source (NestJS)
├── test/                    # E2E tests
├── .env                     # Local environment (not committed)
├── .eslintrc.js             # ESLint rules
├── .gitignore
├── .nvmrc                   # Pinned Node.js major (26 Lithium)
├── .npmrc                   # engine-strict=true
├── .prettierrc              # Prettier formatting
├── nest-cli.json            # Nest CLI / build config
├── package.json             # Dependencies, engines, & npm scripts
├── package-lock.json
├── README.md
├── structure.md             # This file
├── tsconfig.json            # TypeScript base config
└── tsconfig.build.json      # TypeScript build overrides
```

| Path | Role |
| --- | --- |
| `src/` | All application code |
| `test/` | Jest e2e suite |
| `package.json` | Scripts: `start:dev`, migrations, seed, OpenTelemetry entry (`start:dev:otel`) |
| `.husky/pre-commit` | Lint + format staged files via lint-staged |

---

## `src/` — application source

```text
src/
├── apis/                    # Feature / domain modules
├── bootstrap/               # App & Swagger bootstrap helpers
├── common/                  # Shared cross-cutting code
├── config/                  # Env load, Joi schema, typed config
├── core/                    # Infrastructure (DB, cache, queue)
├── integrations/            # External service stubs
├── app.controller.ts        # Root health/demo controller
├── app.controller.spec.ts
├── app.module.ts            # Root Nest module
├── app.service.ts
├── instrumentation.ts       # OpenTelemetry / observability entry
├── main.ts                  # HTTP bootstrap (Fastify)
└── test.ts                  # Misc / scratch test helper
```

### Bootstrap flow (`main.ts`)

1. Create Fastify adapter (`common/Interceptor`)
2. Create Nest app with `AppModule`
3. Attach custom OpenTelemetry logger
4. Register cookie plugin
5. Configure prefix, versioning, pipes (`bootstrap/application.bootstrap.ts`)
6. Configure Swagger (`bootstrap/swagger.bootstrap.ts`)
7. Listen on configured host/port

`AppModule` imports `CoreModule`, `ApisModule`, `CommonModule` and registers global `ValidateApiKeyGuard`.

---

## `src/apis/` — feature modules

Aggregated by `apis.module.ts`. Features: `auth`, `book`, `user` (same layout pattern).

### Example: `apis/book/`

Use this as the template for other feature modules.

```text
apis/
├── apis.module.ts
├── auth/                    # same pattern (auth-specific files)
├── user/                    # same pattern
└── book/                    # ← example below
    ├── book.module.ts
    ├── book.controller.ts   # HTTP routes
    ├── book.service.ts      # business logic
    ├── book.interface.ts    # types / contracts
    ├── dto/
    │   └── book.dto.ts
    ├── entities/
    │   └── book.entity.ts   # TypeORM entity
    └── repository/
        ├── book.repository.ts
        └── interface.ts
```
---

## `src/bootstrap/`

| File | Purpose |
| --- | --- |
| `application.bootstrap.ts` | Global prefix `/api`, URI versioning, validation pipe, etc. |
| `swagger.bootstrap.ts` | Swagger UI setup at `/docs` |

---

## `src/common/` — shared layer

```text
common/
├── common.module.ts
├── constants/               # App constants, enums, exceptions, messages
├── decorators/              # Custom Nest decorators
├── dto/                     # Shared DTOs (pagination, params)
├── functions/               # Pure helper functions
├── guards/                  # Auth / API key / permission guards
├── Interceptor/             # Fastify adapter, plugins, hooks
├── lib/                     # Logger, HTTP client, crypto, hashing, tracing
├── repository/              # Shared TypeORM base repositories
├── token/                   # JWT access/refresh token services
└── utils/                   # Utility Nest module/service
```

### `common/constants/`

| File | Purpose |
| --- | --- |
| `app.constant.ts` | App-wide constants |
| `app.enum.ts` | Shared enums |
| `app.interface.ts` | Shared interfaces |
| `exception.ts` | Exception / error codes |
| `logger.constant.ts` | Logger-related constants |
| `response.message.ts` | Standard response messages |
| `index.ts` | Barrel exports |

### `common/decorators/`

| File | Purpose |
| --- | --- |
| `public.decorator.ts` | `@IsPublic()` — skip API-key guard |
| `roles.decorator.ts` | `@Role()` — RBAC metadata |
| `request.decorator.ts` | Request helpers |
| `validate-ulid.decorator.ts` | ULID validation |
| `apiKey-jwt-swagger.decorator.ts` | Swagger docs for API key / JWT |

### `common/dto/`

| File | Purpose |
| --- | --- |
| `pagination.dto.ts` | Shared pagination query DTO |
| `param.dto.ts` | Shared route/param DTOs |

### `common/guards/`

| File | Purpose |
| --- | --- |
| `api-key.guard.ts` | Global `x-api-key` validation |
| `auth.guard.ts` | JWT cookie authentication |
| `permission.guard.ts` | Role / permission checks |

### `common/Interceptor/` — Fastify HTTP surface

```text
Interceptor/
├── index.ts
├── create-http-adapter.ts           # Builds Nest Fastify adapter
├── register.interceptor.ts
├── tracing.provider.interceptor.ts
├── hooks/
│   ├── cache-control.hook.ts
│   ├── header-validation.hook.ts
│   ├── tracing.hook.ts              # x-request-id reuse/generate
│   └── index.ts
├── parsers/
│   ├── text-plain.parser.ts
│   └── index.ts
└── plugins/
    ├── cookie.plugin.ts
    ├── cors.plugin.ts
    ├── helmet.plugin.ts
    └── index.ts
```

### `common/lib/`

| Path | Purpose |
| --- | --- |
| `lib.module.ts` | Nest module for shared libs |
| `crypto/crypto.ts` | Crypto helpers |
| `hashing/hashing.service.ts` | Password hashing (bcrypt) |
| `hashing/hashing.service.spec.ts` | Unit tests |
| `http/http.service.ts` | Outbound HTTP client |
| `logger/custom.logger.ts` | OpenTelemetry-based Nest logger |
| `logger/logger.provider.ts` | OTEL LoggerProvider DI |
| `logger/tracer.provider.ts` | OTEL TracerProvider DI |
| `tracing/tracing.service.ts` | Request tracing helpers |

### `common/repository/`

| File | Purpose |
| --- | --- |
| `common.repository.ts` | Shared TypeORM repository helpers |
| `transaction.repository.ts` | Transaction helpers |

### `common/token/`

| File | Purpose |
| --- | --- |
| `token.module.ts` | Token Nest module |
| `token.provider.ts` | Token DI / factory |
| `token.service.ts` | Access & refresh JWT issue/verify |

### `common/utils/`

| File | Purpose |
| --- | --- |
| `utils.module.ts` | Utils Nest module |
| `utils.service.ts` | Shared utility methods |

### `common/functions/`

| File | Purpose |
| --- | --- |
| `common.function.ts` | Stateless helper functions |

---

## `src/config/`

| File | Purpose |
| --- | --- |
| `config.ts` | Typed runtime config object |
| `schema.config.ts` | Joi environment schema (required keys) |
| `validation.config.ts` | Env validation wiring |

Startup fails if Joi validation does not pass.

---

## `src/core/` — infrastructure

```text
core/
├── core.module.ts           # Registers cache + database (queue optional)
├── cache/                   # Redis cache abstraction
├── database/                # TypeORM + migrations/seeders
└── queue/                   # RabbitMQ (implemented, not mounted by default)
```

### `core/cache/`

```text
cache/
├── cache.module.ts
├── cache.constants.ts
├── cache.interface.ts
├── keys.ts                  # Cache key builders
└── redis/
    ├── redis.module.ts
    ├── redis.service.ts
    └── redis-client.ts
```

Used for session/token cache when `USE_REDIS=true`.

### `core/database/`

PostgreSQL via TypeORM (`dbo` schema).

```text
database/
├── database.module.ts
├── database.config.ts       # TypeORM / pool options
├── database.provider.ts     # DataSource provider
└── migration_seeder_setup/
    ├── data.source.ts       # CLI DataSource for migrations & seeds
    ├── migrations/
    │   └── 1794563445296-migrationFile.ts
    └── seeds/
        ├── init.seeder.ts
        └── schema.seeder.ts
```

| npm script | Action |
| --- | --- |
| `migration:generate` | Generate migration under `migrations/` |
| `migration:run` | Run migrations + seed |
| `migration:revert` | Revert last migration |
| `seed` | Run typeorm-extension seeders |

### `core/queue/`

RabbitMQ provider (`amqplib`). Present under `src/core/queue` but **not** registered in `CoreModule` by default.

```text
queue/
├── queue.module.ts
├── queue.constants.ts
├── queue.interface.ts
└── rabbit_mq/
    ├── rabbit_mq.service.ts
    └── rabbit_mq.interface.ts
```

---

## `src/integrations/`

External/third-party stubs.

```text
integrations/
└── payments/
    └── payments.integration.ts
```

---

## `test/` — e2e

| File | Purpose |
| --- | --- |
| `app.e2e-spec.ts` | End-to-end Jest tests |
| `jest-e2e.json` | E2E Jest config |

Run with: `npm run test:e2e`

---

## Full file tree (source & config)

```text
.
├── .husky/
│   └── pre-commit
├── src/
│   ├── apis/
│   │   ├── apis.module.ts
│   │   ├── auth/                        # same pattern as book/
│   │   ├── user/                        # same pattern as book/
│   │   └── book/                        # example feature module
│   │       ├── dto/book.dto.ts
│   │       ├── entities/book.entity.ts
│   │       ├── repository/
│   │       │   ├── book.repository.ts
│   │       │   └── interface.ts
│   │       ├── book.controller.ts
│   │       ├── book.interface.ts
│   │       ├── book.module.ts
│   │       └── book.service.ts
│   ├── bootstrap/
│   │   ├── application.bootstrap.ts
│   │   └── swagger.bootstrap.ts
│   ├── common/
│   │   ├── constants/
│   │   │   ├── app.constant.ts
│   │   │   ├── app.enum.ts
│   │   │   ├── app.interface.ts
│   │   │   ├── exception.ts
│   │   │   ├── index.ts
│   │   │   ├── logger.constant.ts
│   │   │   └── response.message.ts
│   │   ├── decorators/
│   │   │   ├── apiKey-jwt-swagger.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   ├── request.decorator.ts
│   │   │   ├── roles.decorator.ts
│   │   │   └── validate-ulid.decorator.ts
│   │   ├── dto/
│   │   │   ├── pagination.dto.ts
│   │   │   └── param.dto.ts
│   │   ├── functions/
│   │   │   └── common.function.ts
│   │   ├── guards/
│   │   │   ├── api-key.guard.ts
│   │   │   ├── auth.guard.ts
│   │   │   └── permission.guard.ts
│   │   ├── Interceptor/
│   │   │   ├── hooks/
│   │   │   │   ├── cache-control.hook.ts
│   │   │   │   ├── header-validation.hook.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── tracing.hook.ts
│   │   │   ├── parsers/
│   │   │   │   ├── index.ts
│   │   │   │   └── text-plain.parser.ts
│   │   │   ├── plugins/
│   │   │   │   ├── cookie.plugin.ts
│   │   │   │   ├── cors.plugin.ts
│   │   │   │   ├── helmet.plugin.ts
│   │   │   │   └── index.ts
│   │   │   ├── create-http-adapter.ts
│   │   │   ├── index.ts
│   │   │   ├── register.interceptor.ts
│   │   │   └── tracing.provider.interceptor.ts
│   │   ├── lib/
│   │   │   ├── crypto/
│   │   │   │   └── crypto.ts
│   │   │   ├── hashing/
│   │   │   │   ├── hashing.service.spec.ts
│   │   │   │   └── hashing.service.ts
│   │   │   ├── http/
│   │   │   │   └── http.service.ts
│   │   │   ├── logger/
│   │   │   │   ├── custom.logger.ts
│   │   │   │   ├── logger.provider.ts
│   │   │   │   └── tracer.provider.ts
│   │   │   ├── tracing/
│   │   │   │   └── tracing.service.ts
│   │   │   └── lib.module.ts
│   │   ├── repository/
│   │   │   ├── common.repository.ts
│   │   │   └── transaction.repository.ts
│   │   ├── token/
│   │   │   ├── token.module.ts
│   │   │   ├── token.provider.ts
│   │   │   └── token.service.ts
│   │   ├── utils/
│   │   │   ├── utils.module.ts
│   │   │   └── utils.service.ts
│   │   └── common.module.ts
│   ├── config/
│   │   ├── config.ts
│   │   ├── schema.config.ts
│   │   └── validation.config.ts
│   ├── core/
│   │   ├── cache/
│   │   │   ├── redis/
│   │   │   │   ├── redis-client.ts
│   │   │   │   ├── redis.module.ts
│   │   │   │   └── redis.service.ts
│   │   │   ├── cache.constants.ts
│   │   │   ├── cache.interface.ts
│   │   │   ├── cache.module.ts
│   │   │   └── keys.ts
│   │   ├── database/
│   │   │   ├── migration_seeder_setup/
│   │   │   │   ├── migrations/
│   │   │   │   │   └── 1794563445296-migrationFile.ts
│   │   │   │   ├── seeds/
│   │   │   │   │   ├── init.seeder.ts
│   │   │   │   │   └── schema.seeder.ts
│   │   │   │   └── data.source.ts
│   │   │   ├── database.config.ts
│   │   │   ├── database.module.ts
│   │   │   └── database.provider.ts
│   │   ├── queue/
│   │   │   ├── rabbit_mq/
│   │   │   │   ├── rabbit_mq.interface.ts
│   │   │   │   └── rabbit_mq.service.ts
│   │   │   ├── queue.constants.ts
│   │   │   ├── queue.interface.ts
│   │   │   └── queue.module.ts
│   │   └── core.module.ts
│   ├── integrations/
│   │   └── payments/
│   │       └── payments.integration.ts
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── instrumentation.ts
│   ├── main.ts
│   └── test.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── structure.md
├── tsconfig.build.json
└── tsconfig.json
```

---

## Layer dependency (high level)

```text
main.ts / instrumentation.ts
        │
        ▼
   AppModule
   ├── CoreModule          → database, cache (+ optional queue)
   ├── ApisModule          → auth, book, user
   └── CommonModule        → guards, lib, token, utils, Interceptor helpers
        │
        ▼
   config/                 → env + Joi validation (loaded early)
```

| Layer | Depends on | Owns |
| --- | --- | --- |
| `apis/` | `common/`, `core/` | Controllers, services, entities, feature repos |
| `common/` | `config/`, Nest core | Guards, decorators, logger, tokens, HTTP adapter |
| `core/` | `config/` | DB, Redis, RabbitMQ |
| `bootstrap/` | Nest app instance | Prefix, pipes, Swagger |
| `integrations/` | — | External stubs |

---

## Excluded from this map

- `node_modules/`
- `dist/` (build output)
- `.git/`
- Husky internal `_/` helpers
