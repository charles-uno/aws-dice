COLOR := $(shell grep COLOR .env | head -n 1 | cut -d = -f 2)
CONTAINER_NAME := $(shell docker ps | grep nginx | head -n 1 | cut -d ' ' -f 1)

build:
	:

# Load balancer only needs to be deployed if it's missing
deploy:
	if [[ "$(CONTAINER_NAME)" == "" ]]; then make deploy-impl; fi

deploy-impl:
	echo "DEPLOYING LOAD BALANCER"
	cp $(COLOR).conf nginx.conf
	docker-compose pull
	docker-compose down ||:
	docker-compose up -d

refresh:
	cp $(COLOR).conf nginx.conf
	docker exec $(CONTAINER_NAME) service nginx reload

# After tests, we want to swap the newly deployed content from dev to main
promote:
	cp $(OTHER_COLOR).conf nginx.conf
	docker exec $(CONTAINER_NAME) service nginx reload

down:
	docker-compose down
