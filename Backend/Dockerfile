FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY --chown=app:app . .

EXPOSE 3000

CMD [ "node", "backend.js" ]
