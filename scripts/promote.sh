#!/bin/bash

set -e

if [[ $(whoami) != ec2-user ]]; then
    echo "no-op for local work"
    exit 0
fi



NEXT_COLOR=$(grep next_color ../color.yml | awk '{print $2}')

cp "scripts/color-$NEXT_COLOR.yml" ../color.yml
