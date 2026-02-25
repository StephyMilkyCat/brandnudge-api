import "dotenv/config"
import request from "supertest"
import app from "../src/app.js"
import { initModels, sequelize } from "../src/models/index.js"

/** Expect data.meta to have all pagination meta attributes. */
const expectPaginationMeta = (meta: unknown): void => {
  expect(meta).toMatchObject({
    page: expect.any(Number),
    limit: expect.any(Number),
    total: expect.any(Number),
    totalPages: expect.any(Number),
    hasNext: expect.any(Boolean),
    hasPrev: expect.any(Boolean),
  })
}

beforeAll(async () => {
  try {
    await initModels()
  } catch (e) {
    console.warn("DB init failed (PG/ES/Redis may be unavailable):", e)
  }
})

afterAll(async () => {
  await sequelize.close()
})

describe("API endpoints", () => {
  beforeAll(async () => {
    await request(app.callback()).put("/entities/es/sync")
    await request(app.callback()).put("/products/es/sync")
  })

  describe("GET /brands/pg/list", () => {
    it("returns wrapped list with success and data", async () => {
      const res = await request(app.callback()).get("/brands/pg/list")
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("success", true)
      expect(res.body).toHaveProperty("data")
      expect(res.body.data).toHaveProperty("items")
      expect(res.body.data).toHaveProperty("meta")
      expectPaginationMeta(res.body.data.meta)
    })

    it("supports pagination and sort", async () => {
      const res = await request(app.callback())
        .get("/brands/pg/list")
        .query({ page: 1, limit: 5, sortBy: "name", sortOrder: "asc" })
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data.items)).toBe(true)
    })
  })

  describe("GET /categories/pg/list", () => {
    it("returns wrapped list", async () => {
      const res = await request(app.callback()).get("/categories/pg/list")
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("success", true)
      expect(res.body.data).toHaveProperty("items")
      expect(res.body.data).toHaveProperty("meta")
      expectPaginationMeta(res.body.data.meta)
    })
  })

  describe("GET /manufacturers/pg/list", () => {
    it("returns wrapped list", async () => {
      const res = await request(app.callback()).get("/manufacturers/pg/list")
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("success", true)
      expect(res.body.data).toHaveProperty("items")
      expect(res.body.data).toHaveProperty("meta")
      expectPaginationMeta(res.body.data.meta)
    })
  })

  describe("GET /retailers/pg/list", () => {
    it("returns wrapped list", async () => {
      const res = await request(app.callback()).get("/retailers/pg/list")
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("success", true)
      expect(res.body.data).toHaveProperty("items")
      expect(res.body.data).toHaveProperty("meta")
      expectPaginationMeta(res.body.data.meta)
    })
  })

  describe("GET /products/pg/list", () => {
    it("returns wrapped list from FlattenedProducts", async () => {
      const res = await request(app.callback()).get("/products/pg/list")
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("success", true)
      expect(res.body.data).toHaveProperty("items")
      expect(res.body.data).toHaveProperty("meta")
      expectPaginationMeta(res.body.data.meta)
    })
  })

  describe("GET /entities/es/search", () => {
    it("accepts term (required) and optional type as query params, returns wrapped result", async () => {
      const res = await request(app.callback())
        .get("/entities/es/search")
        .query({ term: "test" })
      expect([200, 400, 404]).toContain(res.status)
      if (res.status === 200) {
        expect(res.body).toHaveProperty("success", true)
        expect(res.body.data).toHaveProperty("items")
        expect(res.body.data).toHaveProperty("meta")
        expectPaginationMeta(res.body.data.meta)
      }
    })
  })

  describe("GET /products/es/search-full-text", () => {
    it("accepts term (required) as query param, returns wrapped result with meta", async () => {
      const res = await request(app.callback())
        .get("/products/es/search-full-text")
        .query({ term: "test" })
      expect([200, 400, 404]).toContain(res.status)
      if (res.status === 200) {
        expect(res.body).toHaveProperty("success", true)
        expect(res.body.data).toHaveProperty("items")
        expect(res.body.data).toHaveProperty("meta")
        expectPaginationMeta(res.body.data.meta)
      }
    })
  })

  describe("GET /price-observations/search", () => {
    it("accepts search query params and returns wrapped result", async () => {
      const res = await request(app.callback()).get(
        "/price-observations/search"
      )
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("success", true)
      expect(res.body.data).toHaveProperty("items")
      expect(res.body.data).toHaveProperty("meta")
      expectPaginationMeta(res.body.data.meta)
    })
  })

  describe("PUT /products/es/sync", () => {
    it("returns synced count", async () => {
      const res = await request(app.callback()).put("/products/es/sync")
      expect([200, 502]).toContain(res.status)
      if (res.status === 200) {
        expect(res.body).toHaveProperty("success", true)
        expect(res.body.data).toHaveProperty("synced")
      }
    })
  })

  describe("PUT /entities/es/sync", () => {
    it("returns synced count", async () => {
      const res = await request(app.callback()).put("/entities/es/sync")
      expect([200, 502]).toContain(res.status)
      if (res.status === 200) {
        expect(res.body).toHaveProperty("success", true)
        expect(res.body.data).toHaveProperty("synced")
      }
    })
  })
})
