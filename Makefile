
.PHONY: help install dev start serve db-init db-down db-clean lint typecheck codegen clean test health logs

# Default target
help:
	@echo "Available commands:"
	@echo "  help       - Show this help message"
	@echo "  install    - Install dependencies"
	@echo "  dev        - Start development mode (indexer + API with hot reload)"
	@echo "  start      - Start production mode"
	@echo "  serve      - Serve API only (without indexing)"
	@echo "  db-init    - Initialize PostgreSQL database"
	@echo "  db-down    - Stop database services"
	@echo "  db-clean   - Stop and remove database volumes"
	@echo "  lint       - Run ESLint"
	@echo "  typecheck  - Run TypeScript type checking"
	@echo "  codegen    - Generate TypeScript types from schema"
	@echo "  test       - Run all checks (lint + typecheck)"
	@echo "  health     - Check application health"
	@echo "  logs       - Show database logs"
	@echo "  clean      - Clean node_modules and reinstall"

# Dependency management
install:
	pnpm install

clean:
	rm -rf node_modules
	pnpm install

# Development commands
dev: db-init
	pnpm dev

start:
	pnpm start

serve:
	pnpm serve

# Database management
db-init:
	docker compose up -d

db-down:
	docker compose down

db-clean:
	docker compose down -v
	docker compose rm -f

# Code quality
lint:
	pnpm lint

typecheck:
	pnpm typecheck

codegen:
	pnpm codegen

test: lint typecheck
	@echo "All checks passed!"

# Utilities
health:
	@echo "Checking application health..."
	@curl -f http://localhost:42069/healthz 2>/dev/null || echo "API not responding - make sure it's running with 'make dev'"

logs:
	docker compose logs -f postgres

# Legacy aliases for backward compatibility
down: db-down
init: db-init