import type { Context, Next } from "koa"

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ?? "*"
const allowedSet =
  ALLOWED_ORIGINS === "*"
    ? "*"
    : new Set(ALLOWED_ORIGINS.split(",").map(o => o.trim()))

export const cors = async (ctx: Context, next: Next): Promise<void> => {
  const origin = ctx.request.get("Origin")
  if (allowedSet === "*") {
    if (origin) ctx.set("Access-Control-Allow-Origin", origin)
    else ctx.set("Access-Control-Allow-Origin", "*")
  } else if (origin && allowedSet.has(origin)) {
    ctx.set("Access-Control-Allow-Origin", origin)
  }
  ctx.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  )
  ctx.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  ctx.set("Access-Control-Allow-Credentials", "true")
  if (ctx.method === "OPTIONS") {
    ctx.status = 204
    return
  }
  await next()
}
