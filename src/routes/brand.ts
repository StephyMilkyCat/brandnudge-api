import Router from "koa-router"
import * as brand from "../controllers/brand.js"

const router = new Router({ prefix: "/brands" })
router.get("/pg/list", brand.list)
export default router
