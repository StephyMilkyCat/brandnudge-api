import type { Context } from "koa"
import { esClient } from "../../config/elasticsearch.js"
import { ENTITIES_INDEX, entitiesIndexBody } from "../lib/es-indices.js"
import { parseListParams, toOffsetLimit } from "../lib/list-params.js"
import { Brand, Category, Manufacturer, Retailer } from "../models/index.js"
import { fuzzyShould } from "../utils/fuzzy-should.js"

export const searchEs = async (ctx: Context): Promise<void> => {
  const q = ctx.query as Record<string, unknown>
  const term = typeof q.term === "string" ? q.term.trim() : undefined
  const type = typeof q.type === "string" ? q.type.trim() : undefined
  if (term === undefined || term === "") {
    ctx.status = 400
    ctx.body = { error: "term is required and must be a non-empty string" }
    return
  }
  if (type !== undefined && type === "") {
    ctx.status = 400
    ctx.body = { error: "type must be a non-empty string when provided" }
    return
  }
  const params = parseListParams(q)
  const { offset, limit } = toOffsetLimit(params)
  const sortBy = params.sortBy ?? "name"
  const sortOrder = params.sortOrder === "desc" ? "desc" : "asc"
  const sortField = sortBy === "name" ? "name.keyword" : sortBy
  const query = {
    index: ENTITIES_INDEX,
    query: {
      bool: {
        ...(type ? { must: [{ term: { type } }] } : {}),
        should: [fuzzyShould("name", term)],
        minimum_should_match: 1,
      },
    },
    from: offset,
    size: limit,
    sort: [{ [sortField]: sortOrder }],
  }
  const response = await esClient.search(
    query as Parameters<typeof esClient.search>[0]
  )
  const hits = response.hits
  const total =
    typeof hits.total === "number" ? hits.total : (hits.total?.value ?? 0)
  const items = (hits.hits ?? []).map(h => ({
    ...(h._source ?? {}),
    _id: h._id,
  }))
  ctx.body = { items, total }
}

export const syncEs = async (ctx: Context): Promise<void> => {
  await esClient.indices.delete({
    index: ENTITIES_INDEX,
    ignore_unavailable: true,
  })
  await esClient.indices.create({
    index: ENTITIES_INDEX,
    mappings: entitiesIndexBody.mappings as Parameters<
      typeof esClient.indices.create
    >[0]["mappings"],
    settings: entitiesIndexBody.settings as Parameters<
      typeof esClient.indices.create
    >[0]["settings"],
  })
  const [brands, categories, manufacturers, retailers] = await Promise.all([
    Brand.findAll(),
    Category.findAll(),
    Manufacturer.findAll(),
    Retailer.findAll(),
  ])
  const operations: unknown[] = []
  for (const r of brands) {
    operations.push(
      { index: { _index: ENTITIES_INDEX, _id: r.id } },
      { type: "brand", name: r.name }
    )
  }
  for (const r of categories) {
    operations.push(
      { index: { _index: ENTITIES_INDEX, _id: r.id } },
      { type: "category", name: r.name }
    )
  }
  for (const r of manufacturers) {
    operations.push(
      { index: { _index: ENTITIES_INDEX, _id: r.id } },
      { type: "manufacturer", name: r.name }
    )
  }
  for (const r of retailers) {
    operations.push(
      { index: { _index: ENTITIES_INDEX, _id: r.id } },
      { type: "retailer", name: r.name }
    )
  }
  if (operations.length) {
    await esClient.bulk({ refresh: true, operations })
  }
  ctx.body = {
    synced:
      brands.length +
      categories.length +
      manufacturers.length +
      retailers.length,
  }
}
