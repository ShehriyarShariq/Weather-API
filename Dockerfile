FROM node:16-alpine

RUN apk add g++ make py3-pip

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000 3000

CMD ["npm", "run", "start"]