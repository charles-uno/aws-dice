FROM nginx
RUN rm -f /etc/nginx/conf.d/*
EXPOSE 80
COPY nginx.conf /etc/nginx/conf.d/default.conf

# FROM ubuntu:20.04
# RUN rm -f /etc/nginx/conf.d/*
# RUN apt update
# RUN apt-get install -y nginx certbot
# RUN apt-get install -y python3-certbot-nginx
# COPY entrypoint.sh /entrypoint.sh
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# EXPOSE 443
# CMD ["/entrypoint.sh"]
