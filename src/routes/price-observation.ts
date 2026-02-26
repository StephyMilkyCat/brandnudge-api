import Router from "koa-router"
import * as priceObservation from "../controllers/price-observation.js"

const router = new Router({ prefix: "/price-observations" })
router.get("/search-by-attr", priceObservation.searchByAttr)
router.get("/search-by-product-id", priceObservation.searchByProductId)
export default router
