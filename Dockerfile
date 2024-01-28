FROM node:18 as node

WORKDIR /code
COPY ./ ./
RUN npm ci
RUN npm build


FROM nginx:1.23
WORKDIR /usr/share/nginx/html
COPY ./server.conf /etc/nginx/conf.d
RUN rm -rf /usr/share/nginx/html/*
COPY --from=node /code/dist ./