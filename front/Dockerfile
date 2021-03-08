FROM node:alpine
RUN npm install -g npm@7.6.0
COPY app /app
WORKDIR /app
RUN npm install
RUN npm install axios node-sass --save
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "build"]
