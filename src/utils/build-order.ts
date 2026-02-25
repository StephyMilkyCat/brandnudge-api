import type { ListParams } from "../lib/list-params.js"

export const buildOrder = (
  model: { rawAttributes: Record<string, unknown> },
  params: ListParams,
  defaultCol = "name"
): [string, "ASC" | "DESC"] => {
  const col =
    params.sortBy && model.rawAttributes[params.sortBy]
      ? params.sortBy
      : defaultCol
  const order = params.sortOrder ?? "asc"
  return [col, order.toUpperCase() as "ASC" | "DESC"]
}
