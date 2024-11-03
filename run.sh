#!/bin/sh
echo "ENVIRONMENT=$ENVIRONMENT"
echo "BASE_URL=$BASE_URL"
if [ "$ENVIRONMENT" = "debug" ]; then
    sleep infinity
elif [ "$ENVIRONMENT" = "dev" ]; then
    npm run test
fi