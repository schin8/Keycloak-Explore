# Keycloak with PostgreSQL

A local Keycloak identity and access management setup using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [pnpm](https://pnpm.io/installation) (optional, for `sample-app/`)

## Getting Started

1. Create a local `.env` file and set the required passwords. You can copy `.env.example` manually if needed.

```bash
cp .env.example .env
```

2. Start the services:

```bash
make up
```

- **Admin Console:** http://localhost:8080/admin
- **Login:** credentials from your `.env` file

## Make Targets

Use `make help` to see the available shortcuts:

```bash
make help
```

| Target | Description |
|--------|-------------|
| `make up` | Start Keycloak and PostgreSQL in the background |
| `make down` | Stop services and keep persisted data |
| `make reset` | Stop services and remove persisted PostgreSQL data |
| `make restart` | Restart all services |
| `make logs` | Tail logs for all services |
| `make ps` | Show service status |

## Services

| Service    | Port | Description                     |
|------------|------|---------------------------------|
| Keycloak   | 8080 | Identity and access management  |
| PostgreSQL | 5432 | Database for Keycloak           |

## Database Access

Connect via the running container:

```bash
docker exec -it keycloak-postgres psql -U keycloak -d keycloak
```

Or connect from your host:

```bash
psql -h localhost -U keycloak -d keycloak
```

| Setting  | Value                       |
|----------|-----------------------------|
| Host     | localhost                   |
| Port     | 5432                        |
| Database | `POSTGRES_DB` from `.env`   |
| User     | `POSTGRES_USER` from `.env` |
| Password | `POSTGRES_PASSWORD` from `.env` |

## Environment Variables

All secrets are stored in a `.env` file (excluded from version control via `.gitignore`). See `.env.example` for the required variables:

| Variable                   | Description              |
|----------------------------|--------------------------|
| `KEYCLOAK_ADMIN_USERNAME`  | Keycloak admin username  |
| `KEYCLOAK_ADMIN_PASSWORD`  | Keycloak admin password  |
| `POSTGRES_DB`              | PostgreSQL database name |
| `POSTGRES_USER`            | PostgreSQL username      |
| `POSTGRES_PASSWORD`        | PostgreSQL password      |

## Initial Setup (Realm Import)

On first startup, Keycloak automatically imports the realm configuration from `realm-config/my-app-realm.json`. This pre-configures:

> **Note:** Keycloak requires import filenames to follow the pattern `{realm-name}-realm.json`. Since the realm is `my-app`, the file must be named `my-app-realm.json`.

**Realm:** `my-app` (self-registration enabled)

**Client:** `my-web-app`
- Public client (for SPAs/frontend apps)
- Redirect URI: `http://localhost:3000/*`

**Roles:**

| Role      | Description                |
|-----------|----------------------------|
| app-user  | Standard application user  |
| app-admin | Application administrator  |

**Users:**

| Username  | Password  | Roles               |
|-----------|-----------|----------------------|
| testuser  | testuser  | app-user             |
| testadmin | testadmin | app-user, app-admin  |

The import only runs when the realm doesn't already exist in the database. To re-import from scratch, bring everything down with `docker compose down -v` and start again.

With the Makefile, the equivalent reset flow is:

```bash
make reset
make up
```

To customize the initial setup, edit `realm-config/my-app-realm.json` before starting.

## Sample App with pnpm

If you want to work with the optional React sample app from the repository root, use pnpm's `-C` flag to run commands in `sample-app/` without changing directories.

```bash
pnpm -C sample-app install
pnpm -C sample-app dev
```

You can use the same pattern for other commands, for example `pnpm -C sample-app build` or `pnpm -C sample-app lint`.

## Data Persistence

PostgreSQL data is stored in a named Docker volume (`postgres_data`) and persists across restarts.

To stop and **keep** data:

```bash
make down
```

To stop and **delete** data:

```bash
make reset
```
