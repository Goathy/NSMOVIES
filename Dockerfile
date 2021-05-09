FROM node:lts

WORKDIR /app

COPY . .


RUN npm install
RUN npm run build --worspaces
RUN npm run build


CMD ["npm","run","start"]