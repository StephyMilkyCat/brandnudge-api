import type { Context } from "koa"
import { SqlInsight, sequelize } from "../models/index.js"
import { parseListParams, toOffsetLimit } from "../lib/list-params.js"

export const list = async (ctx: Context): Promise<void> => {
  const params = parseListParams(ctx.query as Record<string, unknown>)
  const { offset, limit } = toOffsetLimit(params)
  const { rows, count } = await SqlInsight.findAndCountAll({
    attributes: ["id", "serial", "description"],
    order: [["serial", "ASC"]],
    offset,
    limit,
  })
  ctx.body = {
    items: rows,
    total: count,
  }
}

export const getById = async (ctx: Context): Promise<void> => {
  const id = ctx.params.id as string
  const row = await SqlInsight.findByPk(id)
  if (!row) {
    ctx.status = 404
    ctx.body = null
    return
  }
  let dataset: unknown[] = []
  if (row.sql && row.sql.trim()) {
    try {
      const [rows] = await sequelize.query(row.sql)
      dataset = Array.isArray(rows) ? rows : []
    } catch (err) {
      ctx.status = 422
      ctx.body = {
        error: err instanceof Error ? err.message : "SQL execution failed",
      }
      return
    }
  }
  ctx.body = {
    id: row.id,
    serial: row.serial,
    description: row.description,
    sql: row.sql,
    dataset,
  }
}
