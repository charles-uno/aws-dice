# If working locally, we want to cd into blue-green/workdir before running
# commands. On AWS, we'll already be there
BGDIR := $(shell cd blue-green 2>/dev/null; pwd)
WORKDIR := $(BGDIR)/workdir
COLOR := $(shell cd $(WORKDIR) && grep COLOR ../.env | head -n 1 | cut -d = -f 2)

# Create a local deployment that mimics what we do on AWS
local:
	rm -rf blue-green ||:
	mkdir -p blue-green/workdir
	rsync -r --exclude node_modules app lb scripts blue-green/workdir
	cd blue-green && cp workdir/scripts/blue.env .env

# Figure out color, move things into place, get ready to build
prep: circular-link-check ensure-docker-registry
	# Make sure we always know what color we're deploying
	cd $(WORKDIR) && cp ../.env .env && cp .env app/ && cp .env lb/
	# Move content into place, link back to workdir for a consistent launch
	cd $(BGDIR) && rm -rf $(COLOR) && mv workdir $(COLOR)
	ln -s $(BGDIR)/$(COLOR) $(WORKDIR)

ensure-docker-registry:
	docker ps | grep 'registry:2' || docker run -d --name registry --restart always -p 5000:5000 registry:2

circular-link-check:
	if [[ -L $(WORKDIR) ]]; then exit 1; fi

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
	cd $(WORKDIR) && ./tests/env-consistency.sh
	cd $(WORKDIR)/app && make test

# Promote dev to main
promote:
	exit 1

down:
	cd $(WORKDIR)/app && make down
	cd $(WORKDIR)/lb && make down
