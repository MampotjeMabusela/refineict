FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY . .
RUN node scripts/generate-images.js || true
RUN mkdir -p data
EXPOSE 3000
USER node
CMD ["node", "server.js"]
