import type { Context, Next } from "koa"
import { parseListParams } from "../lib/list-params.js"

/** Build pagination meta from total and page/limit. */
export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number
): {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
} => {
  const totalPages = Math.ceil(total / limit) || 1
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

/**
 * After downstream: if ctx.body is { items, total }, derive page/limit from
 * ctx.query and reshape to { items, meta }.
 */
export const paginationMeta = async (
  ctx: Context,
  next: Next
): Promise<void> => {
  await next()
  const body = ctx.body as
    | { items: unknown[]; total?: number; meta?: unknown }
    | undefined
  if (
    body &&
    typeof body === "object" &&
    "items" in body &&
    Array.isArray(body.items) &&
    "total" in body &&
    typeof body.total === "number" &&
    !("meta" in body)
  ) {
    const params = parseListParams((ctx.query ?? {}) as Record<string, unknown>)
    const page = params.page ?? 1
    const limit = params.limit ?? 50
    const { items, total } = body
    ctx.body = {
      items,
      meta: buildPaginationMeta(total, page, limit),
    }
  }
}
