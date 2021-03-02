#!/bin/bash

DOCKER_USERNAME=charlociraptor
STAMP=$(date +%s)

for DF in */Dockerfile; do
    if [[ ! -f "$DF" ]]; then break; fi
    SERVICE_NAME=$(dirname "$DF")
    cd "$SERVICE_NAME"
    IMAGE_NAME="$DOCKER_USERNAME/eb-$SERVICE_NAME"
    docker build . -t "$IMAGE_NAME:$STAMP"
    docker tag "$IMAGE_NAME:$STAMP" "$IMAGE_NAME:latest"
    docker push "$IMAGE_NAME:$STAMP"
    docker push "$IMAGE_NAME:latest"
    cd ..
done
