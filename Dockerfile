FROM node:14

WORKDIR /app

COPY ["package.json", "package-lock.json*", "/app"]


CMD [ "node", "server.js" ]


