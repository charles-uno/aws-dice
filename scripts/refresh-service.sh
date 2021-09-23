#!/bin/bash

# We're deploying to the next color, not steamrolling the current stable one
COLOR=$(grep next ../color.yml | awk '{print $2}')

cd ../"$COLOR"

docker system prune -af
docker-compose pull
docker-compose down ||:
docker-compose up -d
