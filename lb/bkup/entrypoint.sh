#!/bin/sh

# Verify certbot is installed
# certbot --help

# To use certbot, remove the flag. Then nginx will run in the background and
# certbot will run in the foreground when we get to it
nginx -g 'daemon off;'

# Note: use --dry-run to avoid hitting request limits during development
certbot \
    --non-interactive \
    --agree-tos \
    -m charles.public.account@gmail.com \
    --nginx \
    -d flashcards.charles.uno \
    -d www.flashcards.charles.uno \
    --redirect
