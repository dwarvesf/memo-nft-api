
.PHONY: down init

down:
	docker compose down

init: down
	docker compose up -d