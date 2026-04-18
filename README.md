# Keycloak with PostgreSQL

A local Keycloak identity and access management setup using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [pnpm](https://pnpm.io/installation) (for the sample app)

## Getting Started

1. Copy the example environment file and update the passwords:

```bash
cp .env.example .env
```

2. Start the services:

```bash
docker compose up
```

- **Admin Console:** http://localhost:8080/admin
- **Login:** credentials from your `.env` file

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

To customize the initial setup, edit `realm-config/my-app-realm.json` before starting.

## Sample App

A React + TypeScript app (`sample-app/`) that demonstrates the Keycloak login flow using the official `keycloak-js` adapter.

### Setup

```bash
cd sample-app
pnpm install
```

### Running

Make sure Keycloak is running first (`docker compose up`), then:

```bash
pnpm dev
```

Open http://localhost:3000 and click **Login** to authenticate against Keycloak.

### What it does

- Redirects to the Keycloak login page for the `my-app` realm
- After login, displays the user's profile (username, email, name, roles)
- Shows the raw JWT access token
- Supports logout

### Test credentials

| Username  | Password  | Roles               |
|-----------|-----------|----------------------|
| testuser  | testuser  | app-user             |
| testadmin | testadmin | app-user, app-admin  |

## Data Persistence

PostgreSQL data is stored in a named Docker volume (`postgres_data`) and persists across restarts.

To stop and **keep** data:

```bash
docker compose down
```

To stop and **delete** data:

```bash
docker compose down -v
```
