FROM ubuntu:20.04
# FROM nginx
RUN apt update
RUN apt-get install -y nginx certbot
RUN apt-get install -y python3-certbot-nginx
RUN rm -f /etc/nginx/conf.d/*
EXPOSE 80
EXPOSE 443
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["certbot", "--agree-tos", "-m", "charles.public.account@gmail.com", "--nginx", "-d",  "flashcards.charles.uno", "-d", "www.flashcards.charles.uno"]
