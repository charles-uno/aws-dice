#!/bin/bash

set -e

DOCKER_USERNAME=charlociraptor
STAMP=$(date +%s)

ADDRESS="$1"
if [[ "$ADDRESS" == "" ]]; then
    echo "please give the address of your instance (or localhost)"
    exit 1
else
    echo "deploying to $ADDRESS"
fi

KEYFILE="$2"
if [[ "$ADDRESS" == "localhost" ]]; then
    echo "no key file needed for local deployment"
elif [[ "$KEYFILE" != "" ]]; then
    echo "using key file: $KEYFILE"
else
    KEYFILE=$(ls ~/.ssh/Lightsail*.pem | head -n 1)
    if [[ "$KEYFILE" == "" ]]; then
        echo "please provide a key file"
        exit 1
    else
        echo "found key file: $KEYFILE"
    fi
fi

function ssh_helper {
    if [[ "$ADDRESS" == "localhost" ]]; then
        $@
    else
        timeout 300 ssh -i "$KEYFILE" ec2-user@"$ADDRESS" "$@"
    fi
}

function scp_helper {
    if [[ "$ADDRESS" != "localhost" ]]; then
        # Just copy everything into the home directory
        timeout 300 scp -i "$KEYFILE" "$@" ec2-user@"$ADDRESS":"~"
    fi
}

# Easier to judge what's stale if we're up to date in Git
echo "getting up to date with git"
COMMIT_DIRS=$(ls */Dockerfile | cut -d '/' -f 1)
git add docker-compose.yml $COMMIT_DIRS
git commit -m "pre-deploy commit" >/dev/null ||:

HASH_LOCAL=$(git rev-parse HEAD)
HASH_REMOTE=$(ssh_helper 'cat hash.txt' 2>/dev/null ||:)
# Only need to rebuild things that have changed since the last commit we
# deployed. If there's no remote hash, rebuild everything
if [[ "$HASH_REMOTE" == "" ]]; then
    BUILD_DIRS="$COMMIT_DIRS"
else
    BUILD_DIRS=$(git diff "$HASH_REMOTE" --name-only | grep '/' | cut -d '/' -f 1 | sort | uniq 2>/dev/null)
fi

for DIR in $COMMIT_DIRS; do
    if [[ "$BUILD_DIRS" != *"$DIR"* ]]; then
        echo "$DIR : skipping due to no changes"
        continue
    fi
    # Nothing to build unless there's a Dockerfile
    if [[ ! -f "$DIR/Dockerfile" ]]; then
        echo "$DIR : skipping due to no dockerfile"
        continue
    fi
    echo "$DIR : building..."
    SERVICE_NAME="$DIR"
    IMAGE_NAME="$DOCKER_USERNAME/flashcards-$SERVICE_NAME"
    if ! docker build "$DIR" -f "$DIR/Dockerfile" -t "$IMAGE_NAME:$STAMP" >/dev/null 2>&1; then
        echo "$DIR : docker build failed"
    fi
    echo "$DIR : pushing..."
    docker tag "$IMAGE_NAME:$STAMP" "$IMAGE_NAME:latest" >/dev/null
    docker push "$IMAGE_NAME:$STAMP" >/dev/null
    docker push "$IMAGE_NAME:latest" >/dev/null
done

# Copy files over
echo "copying files over..."
scp_helper docker-compose.yml
echo "$HASH_LOCAL" > hash.txt
scp_helper hash.txt

# Make sure we have access to docker-compose
if ssh_helper 'command -v docker-compose' >/dev/null; then
    echo "verified docker-compose is installed"
else
    if [[ "$ADDRESS" == "localhost" ]]; then
        echo "ERROR: please install docker-compose"
        exit 1
    fi
    echo "installing docker on $ADDRESS"
    ssh_helper 'sudo amazon-linux-extras install -y docker' >/dev/null
    ssh_helper 'sudo service docker start' >/dev/null
    ssh_helper 'sudo usermod -a -G docker ec2-user' >/dev/null
    ssh_helper 'sudo chkconfig docker on' >/dev/null
    ssh_helper 'sudo yum install -y git' >/dev/null
    echo "rebooting $ADDRESS"
    ssh_helper 'sudo reboot' >/dev/null
    # Wait for the machine to come back up...
    MAX_ATTEMPTS=10
    for ATTEMPT in $(seq 1 "$MAX_ATTEMPTS"); do
        echo "waiting for reboot $ATTEMPT/$MAX_ATTEMPTS"
        if ssh_helper 'echo HELLO' >/dev/null 2>&1; then
            break
        fi
        sleep 20
    done
    echo "installing docker-compose"
    ssh_helper 'sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose' >/dev/null 2>&1
    ssh_helper 'sudo chmod +x /usr/local/bin/docker-compose'
    if ! ssh_helper 'docker-compose version' >/dev/null; then
        echo "failed to install requirements!"
        exit 1
    fi
fi

echo "launching services"
ssh_helper "docker-compose down" >/dev/null 2>&1 ||:
ssh_helper "docker-compose pull" >/dev/null 2>&1 ||:
ssh_helper "docker-compose up -d"
