FROM node:16.5.0-alpine

WORKDIR /app

COPY . .
RUN npm ci

ENTRYPOINT [ "npm" ]
CMD [  "start" ]
EXPOSE 80
