#!/bin/bash

set -e

source ../.env

cd ../"$COLOR"

cd app
# docker system prune -af
docker-compose pull
docker-compose down ||:
docker-compose up -d
