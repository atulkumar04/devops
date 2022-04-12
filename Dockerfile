FROM node:16

WORKDIR /usr/src/app

COPY package*.json /usr/src/app


EXPOSE 4000

CMD npm run start



