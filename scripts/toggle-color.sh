#!/bin/bash

NEXT_COLOR=$(grep next ../color.yml | awk '{print $2}')

cp "scripts/color-$NEXT_COLOR.yml" ../color.yml
