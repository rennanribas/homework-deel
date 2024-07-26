FROM node:16

COPY package.json package-lock.json ./

RUN npm ci

COPY src ./src
COPY scripts ./scripts

RUN npm run seed

EXPOSE 3000

CMD ["npm", "start"]