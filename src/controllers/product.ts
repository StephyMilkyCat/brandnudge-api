import type { Context } from "koa"
import { esClient } from "../../config/elasticsearch.js"
import { PRODUCTS_INDEX, productsIndexBody } from "../lib/es-indices.js"
import { parseListParams, toOffsetLimit } from "../lib/list-params.js"
import { Category, FlattenedProduct, Product } from "../models/index.js"
import { buildOrder } from "../utils/build-order.js"
import { fuzzyShould } from "../utils/fuzzy-should.js"
import { trimParam } from "../utils/trim-param.js"
import { getCategoryPathName } from "../utils/get-category-path-name.js"

// ——— Exported ———
export const listPg = async (ctx: Context): Promise<void> => {
  const params = parseListParams(ctx.query as Record<string, unknown>)
  const { offset, limit } = toOffsetLimit(params)
  const order = buildOrder(FlattenedProduct, params, "productTitle")
  const { rows, count } = await FlattenedProduct.findAndCountAll({
    offset,
    limit,
    order: [order],
  })
  ctx.body = { items: rows, total: count }
}

export const searchFullText = async (ctx: Context): Promise<void> => {
  const q = ctx.query as Record<string, unknown>
  const term = typeof q.term === "string" ? q.term.trim() : undefined
  if (term === undefined || term === "") {
    ctx.status = 400
    ctx.body = { error: "term is required and must be a non-empty string" }
    return
  }
  const params = parseListParams(q)
  const { offset, limit } = toOffsetLimit(params)
  const sortBy = params.sortBy ?? "product_title"
  const sortOrder = params.sortOrder === "desc" ? "desc" : "asc"
  const sortField =
    sortBy === "product_title" ? "product_title.keyword" : sortBy
  const query = {
    index: PRODUCTS_INDEX,
    query: {
      bool: {
        should: [
          { term: { ean: term } },
          fuzzyShould("product_title", term),
          fuzzyShould("brand", term),
          fuzzyShould("category", term),
          fuzzyShould("manufacturer", term),
          fuzzyShould("retailer", term),
        ],
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

/** Search products in ES by attributes: ean (exact), brand, category, manufacturer, product_title (fuzzy). */
export const searchByAttr = async (ctx: Context): Promise<void> => {
  const q = ctx.query as Record<string, unknown>
  const params = parseListParams(q)
  const { offset, limit } = toOffsetLimit(params)

  const ean = trimParam(q, "ean")
  const brand = trimParam(q, "brand")
  const category = trimParam(q, "category")
  const manufacturer = trimParam(q, "manufacturer")
  const product_title = trimParam(q, "product_title")

  const must: Record<string, unknown>[] = []
  if (ean) must.push({ term: { ean } })
  if (brand) must.push(fuzzyShould("brand", brand))
  if (category) must.push(fuzzyShould("category", category))
  if (manufacturer) must.push(fuzzyShould("manufacturer", manufacturer))
  if (product_title) must.push(fuzzyShould("product_title", product_title))

  const sortBy = params.sortBy ?? "product_title"
  const sortOrder = params.sortOrder === "desc" ? "desc" : "asc"
  const sortField = `${sortBy}.keyword`

  const query =
    must.length === 0
      ? { match_all: {} }
      : ({ bool: { must } } as Record<string, unknown>)

  const response = await esClient.search({
    index: PRODUCTS_INDEX,
    query,
    from: offset,
    size: limit,
    sort: [{ [sortField]: sortOrder }],
  })

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
    index: PRODUCTS_INDEX,
    ignore_unavailable: true,
  })
  await esClient.indices.create({
    index: PRODUCTS_INDEX,
    mappings: productsIndexBody.mappings as Parameters<
      typeof esClient.indices.create
    >[0]["mappings"],
    settings: productsIndexBody.settings as Parameters<
      typeof esClient.indices.create
    >[0]["settings"],
  })
  const [rows, categories, products] = await Promise.all([
    FlattenedProduct.findAll(),
    Category.findAll(),
    Product.findAll({ attributes: ["id", "categoryId"] }),
  ])
  const categoryById = new Map(categories.map(c => [c.id, c]))
  const productCategoryId = new Map(products.map(p => [p.id, p.categoryId]))
  if (rows.length) {
    const operations = rows.flatMap(r => {
      const categoryId = productCategoryId.get(r.id)
      const category = categoryId ? categoryById.get(categoryId) : undefined
      const categoryPath =
        category != null
          ? getCategoryPathName(category, categoryById)
          : r.category
      const doc = {
        ean: r.ean,
        category: categoryPath,
        manufacturer: r.manufacturer,
        brand: r.brand,
        product_title: r.productTitle,
        image_url: r.imageUrl,
        updated_at: r.updatedAt,
      }
      return [{ index: { _index: PRODUCTS_INDEX, _id: r.id } }, doc]
    })
    await esClient.bulk({ refresh: true, operations })
  }
  ctx.body = { synced: rows.length }
}
