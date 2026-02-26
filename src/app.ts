import Koa from "koa"
import bodyParser from "koa-bodyparser"
import {
  cors,
  paginationMeta,
  responseWrapper,
  sanitizeBody,
} from "./middlewares/index.js"
import brand from "./routes/brand.js"
import category from "./routes/category.js"
import entity from "./routes/entity.js"
import manufacturer from "./routes/manufacturer.js"
import priceObservation from "./routes/price-observation.js"
import product from "./routes/product.js"
import retailer from "./routes/retailer.js"
import sqlInsight from "./routes/sql-insight.js"

const app = new Koa()

app.use(cors)
app.use(bodyParser())
app.use(sanitizeBody)
app.use(responseWrapper)
app.use(paginationMeta)

app.use(brand.routes()).use(brand.allowedMethods())
app.use(category.routes()).use(category.allowedMethods())
app.use(entity.routes()).use(entity.allowedMethods())
app.use(manufacturer.routes()).use(manufacturer.allowedMethods())
app.use(priceObservation.routes()).use(priceObservation.allowedMethods())
app.use(product.routes()).use(product.allowedMethods())
app.use(retailer.routes()).use(retailer.allowedMethods())
app.use(sqlInsight.routes()).use(sqlInsight.allowedMethods())

export default app
