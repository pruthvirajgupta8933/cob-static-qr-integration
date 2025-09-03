#!/bin/sh
# Docker entrypoint script for runtime environment variable substitution

# Replace environment variables in the built React app
# This allows changing API URL without rebuilding the image
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i \
    -e "s|REACT_APP_API_URL_PLACEHOLDER|${REACT_APP_API_URL:-http://localhost:3001/api}|g" \
    -e "s|REACT_APP_ENABLE_QR_FEATURE_PLACEHOLDER|${REACT_APP_ENABLE_QR_FEATURE:-true}|g" \
    {} +

# Execute the main command
exec "$@"