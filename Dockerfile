FROM node:16

WORKDIR /usr/src/app

COPY package*.json


EXPOSE 4000

CMD['node','server.js']

