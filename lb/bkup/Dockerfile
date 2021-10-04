FROM nginx:alpine
RUN rm -f /etc/nginx/conf.d/*
EXPOSE 80
# Install certbot to handle HTTP -> HTTPS
RUN apk add \
    build-base \
    libffi-dev \
    libressl-dev \
    musl-dev \
    python3 \
    python3-dev \
    py3-pip
RUN pip3 install --upgrade pip
RUN export CRYPTOGRAPHY_DONT_BUILD_RUST=1 && pip3 install certbot-nginx
RUN mkdir /etc/letsencrypt
RUN mkdir -p /workdir
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /workdir/entrypoint.sh
RUN chmod +x /workdir/entrypoint.sh
CMD ["/workdir/entrypoint.sh"]


# Installing on Ubuntu seems to work for deployment, but not locally. Probably
# better to just add certbot to the nginx image that works in both places

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
