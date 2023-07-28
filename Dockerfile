FROM node:lts as dependencies
WORKDIR /internal-user-service
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts as builder
WORKDIR /internal-user-service
COPY . .
COPY --from=dependencies /internal-user-service/node_modules ./node_modules
RUN yarn build

FROM node:lts as runner
WORKDIR /internal-user-service
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
COPY --from=builder /internal-user-service/next.config.js ./
COPY --from=builder /internal-user-service/public ./public
COPY --from=builder /internal-user-service/.next ./.next
COPY --from=builder /internal-user-service/node_modules ./node_modules
COPY --from=builder /internal-user-service/package.json ./package.json

ENV DATABASE_URL=${DATABASE_URL}

EXPOSE 3002
CMD ["yarn", "start"]
