FROM node:15-alpine3.13
RUN npm install -g npm@7.11.2
RUN apk update && apk add --no-cache --virtual build-deps \
    g++ \
    make \
    python3
WORKDIR /app
COPY app /app
RUN npm install axios node-sass react-google-charts dotenv --save
COPY ./.env /app/.env
RUN npm run build && npm install -g serve
EXPOSE 5000
CMD ["serve", "-s", "build"]
