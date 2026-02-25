import Router from "koa-router"
import * as category from "../controllers/category.js"

const router = new Router({ prefix: "/categories" })
router.get("/pg/list", category.list)
export default router
