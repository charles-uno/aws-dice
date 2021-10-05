#!/bin/bash

set -e

# Launched from workdir but we need to run in the "real" directory
source .env
cd ../"$COLOR"

make --directory app deploy

# If this is the first build, or we're working locally, we may need to launch
# the load balancer too
if ! docker ps | grep nginx; then
    make --directory lb deploy
fi

# TODO: load balancer should be outside the transient app color directories
