#!/bin/bash

set -exv

IMAGE="quay.io/ia3andy/code-quarkus-product-poc-app"
IMAGE_TAG=$(git rev-parse --short=7 HEAD)

docker build -f Dockerfile.native.multistage -t "${IMAGE}:${IMAGE_TAG}" .

if [[ -n "$QUAY_USER" && -n "$QUAY_TOKEN" ]]; then
    DOCKER_CONF="$PWD/.docker"
    mkdir -p "$DOCKER_CONF"
    docker tag "${IMAGE}:${IMAGE_TAG}" "${IMAGE}:latest"
    docker --config="$DOCKER_CONF" login -u="$QUAY_USER" -p="$QUAY_TOKEN" quay.io
    docker --config="$DOCKER_CONF" push "${IMAGE}:${IMAGE_TAG}"
    docker --config="$DOCKER_CONF" push "${IMAGE}:latest"
fi