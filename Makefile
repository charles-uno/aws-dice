# If working locally, we want to cd into blue-green/workdir before running
# commands. On AWS, we'll already be there
WORKDIR := $(shell cd blue-green/workdir 2>/dev/null; pwd)

# Create a local deployment that mimics what we do on AWS
local:
	rm -rf blue-green ||:
	mkdir -p blue-green/workdir
	rsync -r --exclude node_modules app lb scripts blue-green/workdir

# Move files into place
prep:
	# If we don't have a color, start with blue
	cd $(WORKDIR) && ls ../.env || cp scripts/blue.env ../.env
	# Make sure we always know what color we're deploying
	cd $(WORKDIR) && cp ../.env .
	cd $(WORKDIR) && cp .env app/
	cd $(WORKDIR) && cp .env lb/


	cd $(WORKDIR) && ./scripts/prep.sh

# Build and push docker images
build:
	cd $(WORKDIR)/app && make build
	cd $(WORKDIR)/lb && make build

# Launch services on dev endpoint
deploy:
	cd $(WORKDIR)/app && make deploy
	cd $(WORKDIR)/lb && make deploy

# Test services on dev endpoint
test:
	cd $(WORKDIR)/app && make test

# Promote dev to main
promote:
	exit 1

down:
	cd $(WORKDIR)/app && make down
	cd $(WORKDIR)/lb && make down
