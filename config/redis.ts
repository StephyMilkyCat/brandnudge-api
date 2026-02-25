import Redis from "ioredis"

const redisHost = process.env.REDIS_HOST
const redisPort = Number(process.env.REDIS_PORT)
const redisUser = process.env.REDIS_USER
const redisPassword = process.env.REDIS_PASSWORD

/* eslint-disable @typescript-eslint/no-explicit-any */
export const redis = new (Redis as any)({
  host: redisHost,
  port: redisPort,
  username: redisUser || undefined,
  password: redisPassword || undefined,
})
