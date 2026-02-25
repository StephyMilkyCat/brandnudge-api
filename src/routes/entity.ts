import Router from "koa-router"
import * as entity from "../controllers/entity.js"

const router = new Router({ prefix: "/entities" })
router.get("/es/search", entity.searchEs)
router.put("/es/sync", entity.syncEs)
export default router
