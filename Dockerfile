FROM node:12.2.0-alpine as build_frontend
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./client/package.json /app/package.json
RUN yarn --silent
COPY ./client /app
RUN yarn build

FROM node:12.2.0-alpine as build_backend
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./server/package.json /app/package.json
RUN yarn --silent
COPY --from=build_frontend /app/build /app/public
COPY ./server /app
EXPOSE 8111
CMD ["yarn", "start"]