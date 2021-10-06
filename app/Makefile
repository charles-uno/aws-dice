COLOR := $(shell grep COLOR .env | head -n 1 | cut -d = -f 2)
STAMP := $(shell date +%s)
DOCKER_USER := charlociraptor
DOCKER_DIRS := $(shell ls */Dockerfile | cut -d '/' -f 1)

build: $(DOCKER_DIRS)

$(DOCKER_DIRS):: docker-login
	# In case a service needs to know what color it is
	cp .env $@/
	cd $@ && docker build . -f Dockerfile -t $(DOCKER_USER)/flashcards-$@-$(COLOR):$(STAMP)
	docker tag $(DOCKER_USER)/flashcards-$@-$(COLOR):$(STAMP) $(DOCKER_USER)/flashcards-$@-$(COLOR):latest
	docker push $(DOCKER_USER)/flashcards-$@-$(COLOR):$(STAMP)
	docker push $(DOCKER_USER)/flashcards-$@-$(COLOR):latest

# If credentials aren't set, we're probably working locally on a machine that's
# already logged in.
docker-login:
	@[[ -z "$(DOCKER_PASS)" ]] || echo $(DOCKER_PASS) | docker login -u $(DOCKER_USER) --password-stdin

deploy:
	cd front && make deploy
	cd back && make deploy

test:
	cd back && make test

down:
	docker-compose down
