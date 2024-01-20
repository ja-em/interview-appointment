FROM node:20.11-alpine3.18
WORKDIR /app

# prebuild
COPY .eslintrc.js .
COPY tsconfig.build.json .
COPY nest-cli.json .
COPY package.json .

# build
COPY tsconfig.json .
COPY src ./src
RUN npm install --silent && npm run build
RUN rm -rf ./src
CMD ["node", "dist/main"]