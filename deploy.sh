#!/bin/bash

set -e

ADDRESS="$1"
if [[ "$ADDRESS" == "" ]]; then
    echo "please give the address of your instance"
    exit 1
else
    echo "setting up aws instance at $ADDRESS"
fi

KEYFILE="$2"
if [[ "$KEYFILE" != "" ]]; then
    echo "using aws key file: $KEYFILE"
else
    KEYFILE=$(ls ~/.ssh/Lightsail*.pem | head -n 1)
    if [[ "$KEYFILE" == "" ]]; then
        echo "please provide an aws key file"
        exit 1
    else
        echo "found aws key file: $KEYFILE"
    fi
fi

function ssh_helper {
    timeout 10 ssh -i "$KEYFILE" ec2-user@"$ADDRESS" "$@"
}

# Easier to judge what's stale if we're up to date in Git
git add .; git commit -m "pre-deploy commit"

HASH_LOCAL=$(git rev-parse HEAD)
HASH_REMOTE=$(ssh_helper 'cat ~/hash.txt')
# Only need to rebuild things that have changed since the last commit we
# deployed. If there's no remote hash, rebuild everything
if [[ "$HASH_REMOTE" == "" ]]; then
    BUILD_DIRS=$(ls */Dockerfile | cut -d '/' -f 1)
else
    BUILD_DIRS=$(git diff "$HASH_REMOTE" --name-only | cut -d '/' -f 1 2>/dev/null)
fi

echo "local hash: $HASH_LOCAL"
echo "remote hash: $HASH_REMOTE"
echo "dirs to build: $BUILD_DIRS"


for DIR in $BUILD_DIRS; do
    echo "looking to build $DIR"

done


exit 0


CHECKPOINT=/tmp/install-checkpoint

if [[ ! -f "$CHECKPOINT" ]]; then
    sudo amazon-linux-extras install -y docker
    sudo service docker start
    sudo usermod -a -G docker ec2-user
    sudo chkconfig docker on
    sudo yum install -y git
    touch "$CHECKPOINT"
    sudo reboot
else
    sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    docker-compose version
fi
