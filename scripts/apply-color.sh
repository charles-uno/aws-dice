#!/bin/bash

# If there's no existing deployment, default to blue
COLOR_FILE=~/blue-green/color.yml
if [[ ! -f ../color.yml ]]; then
    cp scripts/color-blue.yml ..
fi

# We're deploying to the next color, not steamrolling the current stable one
COLOR=$(grep next ../color.yml | awk '{print $2}')
PORT1=$(grep port1 ../color.yml | awk '{print $2}')
PORT2=$(grep port2 ../color.yml | awk '{print $2}')

# Turn docker-compose-template.yml into a real docker compose file
sed \
    -e "s/PORT1/$PORT1/g" \
    -e "s/PORT2/$PORT2/g" \
    -e "s/COLOR/$COLOR/g" \
    docker-compose-template.yml > docker-compose.yml

# Clean up any existing content in our color directory and populate it
rm -rf ../"$COLOR"
mkdir -p ../"$COLOR"
cp -r ./* ../"$COLOR"
