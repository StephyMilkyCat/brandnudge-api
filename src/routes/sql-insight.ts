import Router from "koa-router"
import * as sqlInsight from "../controllers/sql-insight.js"

const router = new Router({ prefix: "/sql-insights" })
router.get("/", sqlInsight.list)
router.get("/:id", sqlInsight.getById)
export default router
