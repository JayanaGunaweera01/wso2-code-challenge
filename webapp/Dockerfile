FROM node:16.20.1-alpine AS builder
WORKDIR /app
COPY . .
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci 
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.24-alpine as production
WORKDIR /app
ENV NODE_ENV production
# Copy built assets from the 1st stage
COPY --from=builder /app/build /usr/share/nginx/html
# Add your routing config to nginx
COPY config/nginx.conf /etc/nginx/conf.d/app-default.conf
EXPOSE 5173
# add user
USER 10014
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
