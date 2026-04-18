#!/bin/bash
set -e

# Generate realm JSON from template using environment variables
envsubst < /opt/keycloak/data/import-template/my-app-realm.json.template \
         > /opt/keycloak/data/import/my-app-realm.json

# Start Keycloak
exec /opt/keycloak/bin/kc.sh "$@"
