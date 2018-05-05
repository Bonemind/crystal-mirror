FROM node:9-alpine as builder

RUN apk update && apk add git

WORKDIR /tmp/app/

ADD ./ /tmp/app/

RUN npm install -g yarn
RUN yarn install
RUN yarn build

FROM nginx:mainline-alpine

WORKDIR /web/
COPY --from=builder /tmp/app/dist /web/

COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
