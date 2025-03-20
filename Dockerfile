# Use Node.js to build React app
FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use Nginx to serve the built React app
FROM nginx:alpine

# Copy built React app to Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 4000

CMD ["nginx", "-g", "daemon off;"]
