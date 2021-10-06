#!/bin/bash

set -e

ENV_FILE=../.env

# Figure out which color we're installing
source "$ENV_FILE"
if [[ "$COLOR" == "" ]]; then
    echo "missing color!"
    exit 1
fi

# Move our content over to the appropriate color directory for launch
cd ..
rm -rf "./$COLOR"
mv workdir "$COLOR"
# Set up a soft link so we can continue to launch scripts from workdir
ln -s "$PWD/$COLOR" workdir
