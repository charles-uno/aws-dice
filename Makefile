# If working locally, we want to cd into blue-green/workdir before running
# commands. On AWS, we'll already be there
WORKDIR := $(shell cd blue-green/workdir 2>/dev/null; pwd)
BGDIR := $(shell dirname $(WORKDIR))
COLOR := $(shell cd $(BGDIR) && grep COLOR .env | head -n 1 | cut -d = -f 2)
OTHER_COLOR := $(shell cd $(BGDIR) && grep OTHER .env | head -n 1 | cut -d = -f 2)
TIMESTAMP := $(shell date +%s)

# Create a local deployment that mimics what we do on AWS
local:
	rm -rf blue-green/workdir ||:
	mkdir -p blue-green/workdir
	rsync -r --exclude node_modules Makefile app lb scripts blue-green/workdir
	if [[ "$(COLOR)" == "" ]]; then cd blue-green && cp workdir/scripts/blue.env .env; fi

# Figure out color, move things into place, get ready to build
prep:
	# Make sure we always know what color we're deploying
	cd $(BGDIR) && echo "TIMESTAMP=$(TIMESTAMP)" >> .env
	cd $(BGDIR) && mkdir -p lb/
	cd $(BGDIR) && cp .env workdir/ && cp .env workdir/app/ && cp .env lb/
	# Make sure we have a load balancer set up outside the color dirs
	cd $(BGDIR) && mkdir -p lb
	cd $(BGDIR) && cp -r workdir/lb/* lb/
	# Sanity check: don't make a circular link
	if [[ -L $(WORKDIR) ]]; then exit 1; fi
	# Move content into place, link back to workdir for a consistent launch
	cd $(BGDIR) && rm -rf $(COLOR) && mv workdir $(COLOR)
	ln -s $(BGDIR)/$(COLOR) $(WORKDIR)

registry:
	docker ps | grep 'registry:2' || docker run -d --name registry --restart always -p 5000:5000 registry:2

# Build and push docker images
build:
	cd $(WORKDIR)/app && make build
	cd $(BGDIR)/lb && make build

# Launch services on dev endpoint
deploy:
	cd $(WORKDIR)/app && make deploy
	cd $(BGDIR)/lb && make deploy

# Test services on dev endpoint
test:
	cd $(WORKDIR) && ./tests/env-consistency.sh
	cd $(BGDIR)/app && make test

# Promote dev to main
promote:
	cd $(BGDIR) && cp workdir/scripts/$(OTHER_COLOR).env .env
	cd $(BGDIR) && cp workdir/scripts/$(OTHER_COLOR).env lb/.env
	cd $(BGDIR)/lb && make refresh
	exit 1

down:
	cd $(WORKDIR)/app && make down
	cd $(BGDIR)/lb && make down
