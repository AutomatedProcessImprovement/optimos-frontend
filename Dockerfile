FROM node:alpine as build

WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY .env.production .env.production
COPY vite.config.ts vite.config.ts
COPY index.html index.html
RUN npm ci

COPY tsconfig.json tsconfig.json
COPY tsconfig.node.json tsconfig.node.json
COPY ./public/ ./public
COPY ./src/ ./src
COPY ./nginx/ ./nginx
RUN npm run build

FROM nginx:stable-alpine as production
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]