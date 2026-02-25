import type { Context } from "koa"
import { Manufacturer } from "../models/index.js"
import { parseListParams, toOffsetLimit } from "../lib/list-params.js"
import { buildOrder } from "../utils/build-order.js"

export const list = async (ctx: Context): Promise<void> => {
  const params = parseListParams(ctx.query as Record<string, unknown>)
  const { offset, limit } = toOffsetLimit(params)
  const order = buildOrder(Manufacturer, params)
  const { rows, count } = await Manufacturer.findAndCountAll({
    offset,
    limit,
    order: [order],
  })
  ctx.body = { items: rows, total: count }
}
