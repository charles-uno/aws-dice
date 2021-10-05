#!/bin/bash

set -e

# If we don't have a color in place, pick one
ENV_FILE=../.env
if [[ ! -f "$ENV_FILE" ]]; then
    echo "no color found, defaulting to blue"
    cp scripts/blue.env "$ENV_FILE"
fi

# Figure out which color we're installing
source "$ENV_FILE"
if [[ "$COLOR" == "" ]]; then
    echo "missing color!"
    exit 1
fi
echo "building: $COLOR"

# Make sure we always know what color we're deploying
cp "$ENV_FILE" .
cp "$ENV_FILE" app/
cp "$ENV_FILE" lb/

# Build actually happens in the workdir
for DIR in app lb; do
    make --directory "$DIR" build
done

# Move our content over to the appropriate color directory for launch
rm -rf ../"$COLOR"
mkdir -p ../"$COLOR"
cp -r ./* ../"$COLOR"

# TODO: load balancer should be handled outside app deployment
