#!/bin/bash

set -e

for DIR in app lb; do
    make --directory "$DIR" test
done

exit 1
