#!/bin/bash
set -e

# Install requirements on a fresh AWS server

if docker-compose --version; then
    echo "docker compose already available"
    exit 0
fi

if [[ "$(whoami)" != "ec2-user" ]]; then
    echo "pretty sure you aren't supposed to be running this here"
fi

sudo amazon-linux-extras install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo chkconfig docker on
sudo yum install -y git
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
pip install pytest tavern

if ! docker-compose --version; then
    echo "failed to install docker-compose"
    exit 1
fi
