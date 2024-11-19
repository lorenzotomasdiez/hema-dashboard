## Database

### Backup database using pg_dump

`cd backup`
`PGPASSWORD="XXX" PGSSLMODE=require pg_dump --host=ep-jolly-fog-a4gd8pjp-pooler.us-east-1.aws.neon.tech --port=5432 --username=default --dbname=verceldb > "backup_$(date +%Y-%m-%d_%H-%M-%S).sql"`

### Restore database using pg_restore

`PGPASSWORD="XXX" PGSSLMODE=require pg_restore --host=ep-jolly-fog-a4gd8pjp-pooler.us-east-1.aws.neon.tech --port=5432 --username=default --dbname=verceldb < backup_2024-07-29_19-30-33.sql`

## Force update