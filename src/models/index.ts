import { sequelize } from "../../config/database.js"
import "./manufacturer.js"
import "./brand.js"
import "./category.js"
import "./retailer.js"
import "./product.js"
import "./price-observation.js"
import "./price-trend.js"
import "./flattened-product.js"
import "./flattened-observation.js"
import "./sql-insight.js"

export { Brand } from "./brand.js"
export { Category } from "./category.js"
export { Manufacturer } from "./manufacturer.js"
export { Retailer } from "./retailer.js"
export { Product } from "./product.js"
export { PriceObservation } from "./price-observation.js"
export { PriceTrend } from "./price-trend.js"
export { FlattenedProduct } from "./flattened-product.js"
export { FlattenedObservation } from "./flattened-observation.js"
export { SqlInsight } from "./sql-insight.js"
export { sequelize }

export const initModels = async (): Promise<void> => {
  await sequelize.authenticate()
}
