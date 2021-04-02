#!/bin/bash

nginx

certbot --help

# while :; do sleep 120; done

certbot \
    --non-interactive \
    --agree-tos \
    -m charles.public.account@gmail.com \
    --nginx \
    -d flashcards.charles.uno \
    -d www.flashcards.charles.uno \
    --redirect
