#!/bin/bash

set -e

# If credentials aren't set, we're probably working locally on a machine that's
# already logged in.
if [[ "$DOCKER_PASS" != "" ]]; then
    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
# We keep the Docker username as a secret for convenience, but it's not
# actually sensitive information. It's hard-coded in a bunch of places.
else
    DOCKER_USER=charlociraptor
fi

STAMP=$(date +%s)

# We're deploying to the next color, not steamrolling the current stable one
COLOR=$(grep next ../color.yml | awk '{print $2}')

if [[ "$COLOR" == "" ]]; then
    echo "UNKNOWN COLOR"
    exit 1
fi

echo "DOCKER USERNAME: $DOCKER_USER"

DOCKER_DIRS=$(ls */Dockerfile | cut -d '/' -f 1)
for DIR in $DOCKER_DIRS; do
    echo "$DIR : building..."
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
