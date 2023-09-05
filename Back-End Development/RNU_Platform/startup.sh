#!/bin/sh

if [ "$NODE_ENV" = "production" ]; then
  node index.js;
else
  nodemon index.js;
fi