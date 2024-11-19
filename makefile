ENV_FILE ?= .env

db_backup:
	@echo "Usando archivo de entorno $(ENV_FILE)"
	@export $$(cat $(ENV_FILE) | xargs) && \
	PGPASSWORD=$$POSTGRES_PASSWORD PGSSLMODE=require pg_dump --host=$$POSTGRES_HOST --port=$$POSTGRES_PORT --username=$$POSTGRES_USER --dbname=$$POSTGRES_DATABASE > "./backup/backup_$$(date +%Y-%m-%d_%H-%M-%S).sql"

db_restore:
	@echo "Usando archivo de entorno $(ENV_FILE)"
	@export $$(cat $(ENV_FILE) | xargs) && \
	PGPASSWORD=$$POSTGRES_PASSWORD PGSSLMODE=require psql --host=$$POSTGRES_HOST --port=$$POSTGRES_PORT --username=$$POSTGRES_USER --dbname=$$POSTGRES_DATABASE < "./backup/$(file)"
