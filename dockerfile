FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_BASE_URL=""
ARG VITE_AUTH0_DOMAIN="placeholder.us.auth0.com"
ARG VITE_AUTH0_CLIENT_ID="placeholder"
ARG VITE_AGENT_DOWNLOAD_URL="https://github.com/slogr-io/slogr-agent-kotlin/releases/latest"
ARG VITE_AGENT_INSTALL_CMD=""
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN
ENV VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID
ENV VITE_AGENT_DOWNLOAD_URL=$VITE_AGENT_DOWNLOAD_URL
ENV VITE_AGENT_INSTALL_CMD=$VITE_AGENT_INSTALL_CMD
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
