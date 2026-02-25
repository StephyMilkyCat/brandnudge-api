import type { Context } from "koa"
import { Op, type Order } from "sequelize"
import {
  Brand,
  Category,
  Manufacturer,
  PriceObservation,
  Product,
  Retailer,
} from "../models/index.js"
import { esClient } from "../../config/elasticsearch.js"
import { ENTITIES_INDEX, PRODUCTS_INDEX } from "../lib/es-indices.js"
import { parseListParams, toOffsetLimit } from "../lib/list-params.js"
import { fuzzyShould } from "../utils/fuzzy-should.js"
import { trimParam } from "../utils/trim-param.js"

// ——— Constants / types ———
type JoinedObservation = PriceObservation & {
  Product?:
    | (Product & {
        Brand?: Brand
        Category?: Category
        Manufacturer?: Manufacturer
      })
    | null
  Retailer?: Retailer | null
}

// ——— Helpers (non-exported) ———
/** Build order for searchByAttr. Supports response fields (category, brand, …) and top-level cols. */
const buildSearchOrder = (
  sortBy: string | undefined,
  sortOrder: "asc" | "desc"
): Order => {
  const dir = sortOrder
  if (sortBy === "category") return [[Product, Category, "name", dir]]
  if (sortBy === "brand") return [[Product, Brand, "name", dir]]
  if (sortBy === "manufacturer") return [[Product, Manufacturer, "name", dir]]
  if (sortBy === "product_title") return [[Product, "productTitle", dir]]
  if (sortBy === "retailer") return [[Retailer, "name", dir]]
  if (sortBy) return [[sortBy, dir]]
  return [["date", "desc"]]
}

/** Single ES query against products index; union all hits and return unique product IDs. */
const searchProductsIndex = async (params: {
  ean?: string
  brand?: string
  category?: string
  manufacturer?: string
  product_title?: string
}): Promise<string[]> => {
  const must: Record<string, unknown>[] = []
  if (params.ean) must.push({ term: { ean: params.ean } })
  if (params.brand) must.push(fuzzyShould("brand", params.brand))
  if (params.category) must.push(fuzzyShould("category", params.category))
  if (params.manufacturer)
    must.push(fuzzyShould("manufacturer", params.manufacturer))
  if (params.product_title)
    must.push(fuzzyShould("product_title", params.product_title))

  if (must.length === 0) return []

  const response = await esClient.search({
    index: PRODUCTS_INDEX,
    _source: false,
    query: { bool: { must } } as Record<string, unknown>,
  })
  const hits = response.hits.hits ?? []
  const ids = hits
    .map(h => h._id)
    .filter((id): id is string => typeof id === "string")
  return [...new Set(ids)]
}

/** Search entities index for retailers by name; return matching retailer IDs. */
const searchRetailerIds = async (retailer: string): Promise<string[]> => {
  const response = await esClient.search({
    index: ENTITIES_INDEX,
    _source: false,
    query: {
      bool: {
        must: [{ term: { type: "retailer" } }, fuzzyShould("name", retailer)],
      },
    } as Record<string, unknown>,
  })
  const hits = response.hits.hits ?? []
  const ids = hits
    .map(h => h._id)
    .filter((id): id is string => typeof id === "string")
  return [...new Set(ids)]
}

/** Flatten a price observation row using JOINed Product and Retailer. */
const flattenJoinedObservation = (
  po: JoinedObservation
): Record<string, unknown> => {
  const row = po.get({ plain: true }) as Record<string, unknown>
  const product = po.Product
  return {
    id: row.id,
    date: row.date,
    retailer: po.Retailer?.name ?? null,
    ean: product?.ean ?? null,
    category: product?.Category?.name ?? null,
    manufacturer: product?.Manufacturer?.name ?? null,
    brand: product?.Brand?.name ?? null,
    product_title: product?.productTitle ?? null,
    image_url: product?.imageUrl ?? null,
    on_promotion: row.onPromotion,
    promoted_price: row.promotedPrice,
    base_price: row.basePrice,
    shelf_price: row.shelfPrice,
    promotion_description: row.promotionDescription,
  }
}

// ——— Exported ———
export const searchByAttr = async (ctx: Context): Promise<void> => {
  const q = ctx.query as Record<string, unknown>
  const params = parseListParams(q)
  const { offset, limit } = toOffsetLimit(params)

  const ean = trimParam(q, "ean")
  const brand = trimParam(q, "brand")
  const category = trimParam(q, "category")
  const manufacturer = trimParam(q, "manufacturer")
  const retailer = trimParam(q, "retailer")
  const product_title = trimParam(q, "product_title")

  const [productIds, retailerIds] = await Promise.all([
    searchProductsIndex({
      ean,
      brand,
      category,
      manufacturer,
      product_title,
    }),
    retailer ? searchRetailerIds(retailer) : Promise.resolve([]),
  ])

  const where: {
    productId?: { [Op.in]: string[] }
    retailerId?: { [Op.in]: string[] }
  } = {}
  if (productIds.length > 0) where.productId = { [Op.in]: productIds }
  if (retailerIds.length > 0) where.retailerId = { [Op.in]: retailerIds }
  const hasProductFilter =
    ean ?? brand ?? category ?? manufacturer ?? product_title
  if (productIds.length === 0 && hasProductFilter) {
    ctx.body = { items: [], total: 0 }
    return
  }
  if (retailer && retailerIds.length === 0) {
    ctx.body = { items: [], total: 0 }
    return
  }

  const sortOrder = params.sortOrder ?? "asc"
  const order = buildSearchOrder(params.sortBy, sortOrder)

  const { rows, count } = await PriceObservation.findAndCountAll({
    where: Object.keys(where).length ? where : undefined,
    offset,
    limit,
    order,
    include: [
      {
        model: Product,
        required: true,
        include: [
          { model: Brand, required: true, attributes: ["name"] },
          { model: Category, required: true, attributes: ["name"] },
          { model: Manufacturer, required: true, attributes: ["name"] },
        ],
      },
      { model: Retailer, required: true },
    ],
  })

  const items = rows.map(po =>
    flattenJoinedObservation(po as JoinedObservation)
  )
  ctx.body = { items, total: count }
}
