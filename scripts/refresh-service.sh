#!/bin/bash

# Figure out which color we just deployed
COLOR=$(grep color scratch/color.yml | awk '{print $2}')

cd "$COLOR"

docker system prune -af
docker-compose pull
docker-compose down ||:
docker-compose up -d
