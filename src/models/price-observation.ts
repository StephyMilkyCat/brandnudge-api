import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize"
import { sequelize } from "../../config/database.js"
import { Product } from "./product.js"
import { Retailer } from "./retailer.js"

export class PriceObservation extends Model<
  InferAttributes<PriceObservation>,
  InferCreationAttributes<PriceObservation>
> {
  declare id: string
  declare productId: string
  declare retailerId: string
  declare year: number
  declare month: number
  declare day: number
  declare date: Date
  declare basePrice: number
  declare shelfPrice: number
  declare promotedPrice: number
  declare onPromotion: boolean
  declare promotionDescription: string | null
}

PriceObservation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "product_id",
      references: { model: "products", key: "id" },
    },
    retailerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "retailer_id",
      references: { model: "retailers", key: "id" },
    },
    year: { type: DataTypes.INTEGER, allowNull: false },
    month: { type: DataTypes.INTEGER, allowNull: false },
    day: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "base_price",
    },
    shelfPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "shelf_price",
    },
    promotedPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "promoted_price",
    },
    onPromotion: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "on_promotion",
    },
    promotionDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "promotion_description",
    },
  },
  { sequelize, tableName: "price_observations", timestamps: false }
)

PriceObservation.belongsTo(Product, { foreignKey: "productId" })
PriceObservation.belongsTo(Retailer, { foreignKey: "retailerId" })
