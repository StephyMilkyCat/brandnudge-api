import Router from "koa-router"
import * as retailer from "../controllers/retailer.js"

const router = new Router({ prefix: "/retailers" })
router.get("/pg/list", retailer.list)
export default router
