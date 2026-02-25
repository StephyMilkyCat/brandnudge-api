import Router from "koa-router"
import * as manufacturer from "../controllers/manufacturer.js"

const router = new Router({ prefix: "/manufacturers" })
router.get("/pg/list", manufacturer.list)
export default router
