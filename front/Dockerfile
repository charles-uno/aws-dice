FROM node:alpine
RUN npm install -g npm@7.6.1
COPY app /app
WORKDIR /app
RUN npm install
RUN npm install axios node-sass --save
RUN npm run build
RUN npm install -g serve
EXPOSE 5000
CMD ["serve", "-s", "build"]
