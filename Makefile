.DEFAULT_GOAL := help

COMPOSE := docker compose

.PHONY: up down reset restart logs ps help

##@ Keycloak instance
up: ## Start Keycloak and PostgreSQL in the background
	$(COMPOSE) up -d

down: ## Stop services and keep persisted data
	$(COMPOSE) down

reset: ## Stop services and remove persisted PostgreSQL data
	$(COMPOSE) down -v

restart: down up ## Restart all services

logs: ## Tail logs for all services
	$(COMPOSE) logs -f

ps: ## Show service status
	$(COMPOSE) ps

##@ General
help: ## Show available commands
	@printf "\n\033[1mAvailable targets:\033[0m\n\n"
	@awk 'BEGIN {FS = ":.*## "; cyan = "\033[36m"; yellow = "\033[33m"; bold = "\033[1m"; reset = "\033[0m"} \
		/^##@ / {printf "\n" bold yellow "%s" reset "\n", substr($$0, 5); next} \
		/^[a-zA-Z0-9_.-]+:.*## / {printf "  " cyan "%-16s" reset " %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@printf "\n"
