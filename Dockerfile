FROM node:14

WORKDIR /app

COPY . .

EXPOSE 4000

CMD npm run start


