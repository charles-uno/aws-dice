#!/bin/bash

# Figure out which color we just deployed
COLOR=$(cat color.txt)

cd "$COLOR"

docker system prune -af
docker-compose pull
docker-compose down ||:
docker-compose up -d
