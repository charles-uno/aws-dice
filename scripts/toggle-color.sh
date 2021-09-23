#!/bin/bash

# Move the color we just deployed to color.yml for artifact upload
NEXT_COLOR=$(grep next color.yml | awk '{print $2}')

cp "scripts/color-$NEXT_COLOR.yml" color.yml
