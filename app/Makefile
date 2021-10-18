COLOR := $(shell grep COLOR .env | head -n 1 | cut -d = -f 2)
STAMP := $(shell date +%s)
REGISTRY := $(shell grep REGISTRY .env | head -n 1 | cut -d = -f 2)
DIRS := $(shell ls */Dockerfile | cut -d '/' -f 1)
# DOCKER_USER := charlociraptor

build: $(DIRS)

$(DIRS):: #docker-login
	# In case a service needs to know what color it is
	cp .env $@/
	cd $@ && docker build . -f Dockerfile -t $(REGISTRY)/flashcards-$@-$(COLOR):$(STAMP)
	docker tag $(REGISTRY)/flashcards-$@-$(COLOR):$(STAMP) $(REGISTRY)/flashcards-$@-$(COLOR):latest
	docker push $(REGISTRY)/flashcards-$@-$(COLOR):$(STAMP)
	docker push $(REGISTRY)/flashcards-$@-$(COLOR):latest

# If credentials aren't set, we're probably working locally on a machine that's
# already logged in.
#docker-login:
#	@[[ -z "$(DOCKER_PASS)" ]] || echo $(DOCKER_PASS) | docker login -u $(DOCKER_USER) --password-stdin

deploy:
	# docker system prune -af
	docker-compose pull
	docker-compose down ||:
	docker-compose up -d

test:
	cd back && make test

down:
	docker-compose down
