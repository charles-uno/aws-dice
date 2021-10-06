COLOR := $(shell grep COLOR .env | head -n 1 | cut -d = -f 2)

debug:
	echo $(COLOR)

build:
	:

deploy:
	cp $(COLOR).conf nginx.conf
	# docker system prune -af
	docker-compose pull
	docker-compose down ||:
	docker-compose up -d

down:
	docker-compose down
