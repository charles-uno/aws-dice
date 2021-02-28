#!/bin/bash

PORT=80
NAME=aws-practice

docker build . -f Dockerfile -t ${NAME}

docker run -d -p ${PORT}:${PORT} --name ${NAME} --rm ${NAME} \
		gunicorn app:app -b 0.0.0.0:${PORT}
