#!/bin/bash

set -e

# Launched from workdir but we need to run in the "real" directory
source .env
cd ../"$COLOR"

# TODO: actually don't want to flip the load balancer until promote time

make --directory app deploy
make --directory lb deploy
