NAME = aws-dice
PORT = 5001

.PHONY: image app all

all: app

image: Dockerfile app.py
	docker build . -f Dockerfile -t $(NAME)

app: image
	docker run -p $(PORT):$(PORT) --name $(NAME) --rm $(NAME) \
		gunicorn app:app -b 0.0.0.0:$(PORT)
