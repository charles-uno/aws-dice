#!/bin/bash

nginx

# AWS blocks port 443 so SSL via Certbot won't work. Loop here forever
# while :; do sleep 120; done

certbot \
    --non-interactive \
    --agree-tos \
    -m charles.public.account@gmail.com \
    --nginx \
    -d flashcards.charles.uno \
    -d www.flashcards.charles.uno \
    --redirect
