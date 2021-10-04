#!/bin/bash

set -e

# We start with everything in blue-green/workdir

# If we don't have a color in place, pick one
ENV_FILE=../.env
if [[ ! -f "$ENV_FILE" ]]; then
    cp scripts/blue.env "$ENV_FILE"
fi

# Figure out which color we're installing
source "$ENV_FILE"
if [[ "$COLOR" == "" ]]; then
    echo "missing color!"
    exit 1
fi
echo "installing: $COLOR"

# App and load balancer both need to know which color we're deploying
cp "$ENV_FILE" app/
cp "$ENV_FILE" lb/

# Clean up any existing content in our color directory and populate it
rm -rf ../"$COLOR"
mkdir -p ../"$COLOR"
cp -r ./* ../"$COLOR"
