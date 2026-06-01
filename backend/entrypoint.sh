#!/bin/sh
set -e

python manage.py migrate --noinput
python manage.py collectstatic --noinput

GUNICORN_WORKERS=2
echo "Starting Gunicorn with $GUNICORN_WORKERS workers"
exec gunicorn \
    --workers "$GUNICORN_WORKERS" \
    --bind 0.0.0.0:8000 \
    alcobottle.wsgi \
    --access-logfile - \
    --error-logfile -
