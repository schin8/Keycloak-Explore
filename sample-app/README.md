# Keycloak Sample App

This Vite React app connects to the local Keycloak instance defined in the repository root.

## Setup

1. Copy the example env file.
2. Install dependencies.
3. Start the dev server.

```bash
cp .env.example .env
pnpm install
pnpm dev
```

The app expects these variables:

- `VITE_KEYCLOAK_URL`
- `VITE_KEYCLOAK_REALM`
- `VITE_KEYCLOAK_CLIENT_ID`

By default, `.env.example` points at the local realm and client created by the main Keycloak setup in this repository.

## Available Commands

- `pnpm dev` starts the Vite dev server on port 3000
- `pnpm build` creates a production build
- `pnpm lint` runs ESLint
- `pnpm preview` serves the production build locally
