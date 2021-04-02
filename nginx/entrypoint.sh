#!/bin/bash

nginx

while :; do sleep 120; done

# Note: use --dry-run to avoid hitting request limits
certbot \
    --non-interactive \
    --agree-tos \
    -m charles.public.account@gmail.com \
    --nginx \
    -d flashcards.charles.uno \
    -d www.flashcards.charles.uno \
    --redirect \
    --dry-run
