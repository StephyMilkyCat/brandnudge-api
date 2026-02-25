import Router from "koa-router"
import * as product from "../controllers/product.js"

const router = new Router({ prefix: "/products" })
router.get("/pg/list", product.listPg)
router.get("/es/search-full-text", product.searchFullText)
router.get("/es/search-by-attr", product.searchByAttr)
router.put("/es/sync", product.syncEs)
export default router
