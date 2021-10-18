#!/bin/bash

# Make sure environment variables have not changed between the existing
# environment and the one we're deploying

get_keys() {
    cat $1 | cut -d = -f 1 | sort
}

OLD_KEYS=$(get_keys ../.env)

for KEY_FILE in scripts/*.env; do
    [[ -e "$KEY_FILE" ]] || continue
    NEW_KEYS=$(get_keys $NEW_FILE)
    if [[ "$OLD_KEYS" != "$NEW_KEYS" ]]; then
        echo "$KEY_FILE has different keys!"
        exit 1
    fi
done
