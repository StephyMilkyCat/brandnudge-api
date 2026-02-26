import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize"
import { sequelize } from "../../config/database.js"
import { Product } from "./product.js"
import { Retailer } from "./retailer.js"

export class PriceTrend extends Model<
  InferAttributes<PriceTrend>,
  InferCreationAttributes<PriceTrend>
> {
  declare productId: string
  declare date: Date
  declare retailerId: string
  declare price: number
}

PriceTrend.init(
  {
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: "product_id",
      references: { model: "products", key: "id" },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true,
    },
    retailerId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: "retailer_id",
      references: { model: "retailers", key: "id" },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "price_trends",
    timestamps: false,
  }
)

PriceTrend.belongsTo(Product, { foreignKey: "productId" })
PriceTrend.belongsTo(Retailer, { foreignKey: "retailerId" })
