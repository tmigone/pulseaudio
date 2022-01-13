#!/bin/bash

BALENA_FLEET=${BALENA_FLEET:-patest}

function pushToBalena () {
  local YML="$1"
  local FLEET="$2"
  local TAG="$3"

  cp "$YML" docker-compose.yml
  balena push "$FLEET" --release-tag "$TAG"
  rm docker-compose.yml
}

pushToBalena pulseaudio-v13.yml "$BALENA_FLEET" "pa13"
pushToBalena pulseaudio-v15.yml "$BALENA_FLEET" "pa15"