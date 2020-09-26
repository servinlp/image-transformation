FROM node:12 as builder

WORKDIR /usr/src/app

RUN wget https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-1.1.0-linux-x86-64.tar.gz
RUN tar -zxvf ./libwebp-1.1.0-linux-x86-64.tar.gz
RUN mkdir webp
RUN cp ./libwebp-1.1.0-linux-x86-64/bin/cwebp ./webp
RUN cp ./libwebp-1.1.0-linux-x86-64/bin/dwebp ./webp
RUN rm -rf ./libwebp-1.1.0-linux-x86-64

COPY package.json ./
COPY yarn.lock ./

RUN yarn install
COPY . .
RUN yarn build



FROM node:12-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .
RUN yarn install --production=true
CMD ["yarn", "start"]