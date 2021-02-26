#!/bin/bash

PORT=5001
NAME=aws-dice

docker build . -f Dockerfile -t ${NAME}

docker run -p ${PORT}:${PORT} --name ${NAME} --rm ${NAME} \
		gunicorn app:app -b 0.0.0.0:${PORT}
