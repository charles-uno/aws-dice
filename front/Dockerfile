FROM node:15-alpine3.13
RUN npm install -g npm@7.11.2
COPY app /app
WORKDIR /app
RUN apk update && apk add --no-cache --virtual build-deps \
    g++ \
    make \
    python3
RUN npm install axios node-sass react-google-charts --save
RUN npm run build
RUN npm install -g serve
EXPOSE 5000
CMD ["serve", "-s", "build"]
