#! /bin/sh

docker-compose -f compose/dev.yml kill
docker-compose --env-file .env.dev -f compose/dev.yml up -d --remove-orphans