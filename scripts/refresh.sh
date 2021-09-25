#!/bin/bash

if [[ $(whoami) != ec2-user ]]; then
    echo "no-op for local work"
    exit 0
fi

# We're deploying to the next color, not steamrolling the current stable one
COLOR=$(grep next ../color.yml | awk '{print $2}')

cd ../"$COLOR"

docker system prune -af
docker-compose pull
docker-compose down ||:
docker-compose up -d
