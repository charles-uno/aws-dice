#!/bin/bash


# TODO: be able to run the front in interactive mode rather than building it


set -e

source .env

# At this point we need to be in the "real" directory, not workdir
DIR=$(realpath "$PWD")
if [[ "$DIR" != *$COLOR* ]]; then
    echo "needs to run from $COLOR directory not $DIR"
    exit 1
fi

# TODO: Hold off on prunes as we get blue-green figured out
# docker system prune -af

docker-compose pull
docker-compose down ||:
docker-compose up -d
