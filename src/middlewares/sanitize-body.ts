import type { Context, Next } from "koa"

const sanitize = (value: unknown): unknown => {
  if (value === null || value === undefined) return value
  if (typeof value === "string")
    return value
      .replace(/[<>]/g, "")
      .replace(/javascript:/gi, "")
      .trim()
  if (Array.isArray(value)) return value.map(sanitize)
  if (typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = sanitize(v)
    return out
  }
  return value
}

export const sanitizeBody = async (ctx: Context, next: Next): Promise<void> => {
  if (ctx.request.body && typeof ctx.request.body === "object") {
    ctx.request.body = sanitize(ctx.request.body) as Record<string, unknown>
  }
  await next()
}
