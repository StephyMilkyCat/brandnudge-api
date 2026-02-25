export interface ListParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 50
const MAX_LIMIT = 500

export const parseListParams = (query: Record<string, unknown>): ListParams => {
  const page = Math.max(1, Number(query.page) || DEFAULT_PAGE)
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(query.limit) || DEFAULT_LIMIT)
  )
  const sortBy = typeof query.sortBy === "string" ? query.sortBy : undefined
  const order = query.sortOrder === "desc" ? "desc" : "asc"
  return { page, limit, sortBy, sortOrder: order }
}

export const toOffsetLimit = (
  params: ListParams
): {
  offset: number
  limit: number
} => {
  const page = params.page ?? DEFAULT_PAGE
  const limit = params.limit ?? DEFAULT_LIMIT
  return { offset: (page - 1) * limit, limit }
}
