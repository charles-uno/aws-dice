#!/bin/bash

set -e

ENV_FILE=.env
source "$ENV_FILE"

# If credentials aren't set, we're probably working locally on a machine that's
# already logged in.
if [[ "$DOCKER_PASS" != "" ]]; then
    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
# We keep the Docker username as a secret for convenience, but it's not
# actually sensitive information. It's hard-coded in a bunch of places.
else
    DOCKER_USER=charlociraptor
fi

# Build and push the docker images

STAMP=$(date +%s)

DOCKER_DIRS=$(ls */Dockerfile | cut -d '/' -f 1)
for DIR in $DOCKER_DIRS; do
    # Optionally, target names can be given. In that case, only build those
    if [[ "$@" != "" && "$@" != *$DIR* ]]; then
        echo "$DIR : skipping"
        continue
    fi
    echo "$DIR : building..."
    # Put the env file in the images so apps know what color they are
    cp "$ENV_FILE" "$DIR/"
    SERVICE_NAME="$DIR"
    IMAGE_NAME="$DOCKER_USER/flashcards-$SERVICE_NAME-$COLOR"
    if ! docker build "$DIR" -f "$DIR/Dockerfile" -t "$IMAGE_NAME:$STAMP"; then
        echo "$DIR : docker build failed"
        exit 1
    fi
    echo "$DIR : pushing..."
    docker tag "$IMAGE_NAME:$STAMP" "$IMAGE_NAME:latest"
    docker push "$IMAGE_NAME:$STAMP"
    docker push "$IMAGE_NAME:latest"
done
