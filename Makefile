COLOR := green

# Create a local deployment that mimics what we do on AWS
local:
	rm -rf blue-green ||:
	mkdir -p blue-green/workdir
	cp -r app lb scripts blue-green/workdir/
	cp scripts/$(COLOR).env blue-green/.env
	echo "REACT_APP_LOCAL=true" >> blue-green/.env

# Build and push images, move files into place
build:
	cd blue-green/workdir && ./scripts/build.sh

# Launch services on dev endpoint
deploy:
	cd blue-green/workdir && ./scripts/deploy.sh

# Test services on dev endpoint
test:
	cd blue-green/workdir && ./scripts/test.sh

# Promote dev to main
promote:
	cd blue-green/workdir && ./scripts/promote.sh

down:
	cd blue-green/$COLOR/app && docker-compose down
	cd blue-green/$COLOR/lb && docker-compose down
