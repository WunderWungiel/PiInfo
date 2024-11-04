#!/bin/sh

python3 -m gunicorn --workers 8 --bind 0.0.0.0:8080 main:app
