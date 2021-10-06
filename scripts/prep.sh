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

echo "prepping: $COLOR"

# Make sure we always know what color we're deploying
cp "$ENV_FILE" .
cp "$ENV_FILE" app/
cp "$ENV_FILE" lb/

# Move our content over to the appropriate color directory for launch
cd ..
rm -rf "./$COLOR"
mv workdir "$COLOR"
# Set up a soft link so we can continue to launch scripts from workdir
ln -s "$PWD/$COLOR" workdir
