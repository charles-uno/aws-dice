#!/bin/bash

PREV_COLOR=$(cat color.txt)

if [[ "$PREV_COLOR" == blue ]]; then
    NEXT_COLOR=green
else
    NEXT_COLOR=blue
fi

echo "$NEXT_COLOR" > color.txt
