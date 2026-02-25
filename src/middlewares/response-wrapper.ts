import type { Context, Next } from "koa"

export const responseWrapper = async (
  ctx: Context,
  next: Next
): Promise<void> => {
  await next()
  if (ctx.body === undefined) return
  if (ctx.response.is("json") === false && ctx.response.type) return
  const success = ctx.status >= 200 && ctx.status < 300
  const data = ctx.body
  ctx.type = "application/json"
  ctx.body = { success, data }
}
