FROM node:14

WORKDIR /app

COPY . .

EXPOSE 4000

CMD [ "node", "server.js" ]


