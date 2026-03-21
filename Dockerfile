FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]


