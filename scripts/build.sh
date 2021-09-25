#!/bin/bash

set -e

# For local debugging, we're sitting in the root of the repo. For deployments,
# we're in ~/blue-green/workdir and we need to put files in place elsewhere
function is_local {
    if [[ $(whoami) == ec2-user ]]; then return 1; else return 0; fi
}

if is_local; then
    COLOR_YML=scripts/color-blue.yml
else
    COLOR_YML=../color.yml
fi

if [[ ! -f "$COLOR_YML" ]]; then
    echo "missing color file!"
    exit 1
fi

# We're deploying to the next color, not steamrolling the current stable one
COLOR=$(grep next "$COLOR_YML" | awk '{print $2}')
PORT1=$(grep port1 "$COLOR_YML" | awk '{print $2}')
PORT2=$(grep port2 "$COLOR_YML" | awk '{print $2}')

# Turn docker-compose-template.yml into a real docker compose file
sed \
    -e "s/PORT1/$PORT1/g" \
    -e "s/PORT2/$PORT2/g" \
    -e "s/COLOR/$COLOR/g" \
    docker-compose-template.yml > docker-compose.yml

# Build and push the docker images

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
