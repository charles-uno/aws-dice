#!/bin/bash

# Everything gets copied over into ~/blue-green/workdir
# Move files into ~/blue-green/blue or ~/blue-green/green

# Move files
if [[ $(whoami) != ec2-user ]]; then
    echo "no-op for local work"
fi

# If there's no existing deployment, default to blue
if [[ ! -f ../color.yml ]]; then
    cp scripts/color-blue.yml ../color.yml
fi

# We're deploying to the next color, not steamrolling the current stable one
COLOR=$(grep next ../color.yml | awk '{print $2}')

# Clean up any existing content in our color directory and populate it
rm -rf ../"$COLOR"
mkdir -p ../"$COLOR"
cp -r ./* ../"$COLOR"
