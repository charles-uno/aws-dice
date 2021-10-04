
# Copy the repo over as-is
local:
	rm -rf blue-green ||:
	mkdir -p blue-green/workdir
	# takes a bit because of the node modules
	cp -r app lb scripts blue-green/workdir/

# Move files into place for this deployment (blue or green)
install:
	cd blue-green/workdir && ./scripts/install.sh

# Build docker images
build:
	cd blue-green/workdir && ./scripts/build.sh

# Launch services on dev endpoint
refresh:
	cd blue-green/workdir && ./scripts/refresh.sh

# Test services on dev endpoint
test:
	cd blue-green/workdir && ./scripts/test.sh

# Promote dev to main
promote:
	cd blue-green/workdir && ./scripts/promote.sh
