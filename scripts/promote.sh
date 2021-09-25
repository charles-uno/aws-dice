#!/bin/bash

# If we deployed successfully to green, update nginx to point to blue and set
# the next deployment to be green

if [[ $(whoami) != ec2-user ]]; then
    echo "no-op for local work"
    exit 0
fi

NEXT_COLOR=$(grep next ../color.yml | awk '{print $2}')

cp "scripts/color-$NEXT_COLOR.yml" ../color.yml
