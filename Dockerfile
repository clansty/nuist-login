FROM node:17-alpine

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/

RUN yarn install

COPY index.js /app/index.js

CMD [ "yarn", "start" ]
