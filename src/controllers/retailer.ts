import type { Context } from "koa"
import { Retailer } from "../models/index.js"
import { parseListParams, toOffsetLimit } from "../lib/list-params.js"
import { buildOrder } from "../utils/build-order.js"

export const list = async (ctx: Context): Promise<void> => {
  const params = parseListParams(ctx.query as Record<string, unknown>)
  const { offset, limit } = toOffsetLimit(params)
  const order = buildOrder(Retailer, params)
  const { rows, count } = await Retailer.findAndCountAll({
    offset,
    limit,
    order: [order],
  })
  ctx.body = { items: rows, total: count }
}
