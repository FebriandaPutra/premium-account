# Phase 1
FROM node:16-alpine as builder
WORKDIR /react-app
COPY package*.json .
COPY yarn.lock .
COPY vite.config.ts .
COPY tsconfig.json .
COPY .yarnrc.yml .
RUN yarn install
COPY . .
RUN yarn build
CMD ["yarn", "preview", "--host", "0.0.0.0"]


# Phase 2
# FROM nginx:latest
# WORKDIR /usr/share/nginx/html
# RUN rm -rf ./*
# COPY --from=builder /react-app/build .
# ENTRYPOINT [ "nginx", "-g", "daemon off;" ]