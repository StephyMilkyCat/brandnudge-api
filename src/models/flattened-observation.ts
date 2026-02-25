import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize"
import { sequelize } from "../../config/database.js"

export class FlattenedObservation extends Model<
  InferAttributes<FlattenedObservation>,
  InferCreationAttributes<FlattenedObservation>
> {
  declare id: string
  declare date: Date
  declare retailer: string
  declare ean: string
  declare category: string
  declare manufacturer: string
  declare brand: string
  declare productTitle: string
  declare image: string | null
  declare onPromotion: boolean
  declare promotionDescription: string | null
  declare basePrice: number
  declare shelfPrice: number
  declare promotedPrice: number
}

FlattenedObservation.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    date: { type: DataTypes.DATEONLY },
    retailer: { type: DataTypes.STRING },
    ean: { type: DataTypes.STRING(20) },
    category: { type: DataTypes.STRING },
    manufacturer: { type: DataTypes.STRING },
    brand: { type: DataTypes.STRING },
    productTitle: { type: DataTypes.STRING(255), field: "product_title" },
    image: { type: DataTypes.STRING(512) },
    onPromotion: { type: DataTypes.BOOLEAN, field: "on_promotion" },
    promotionDescription: {
      type: DataTypes.TEXT,
      field: "promotion_description",
    },
    basePrice: { type: DataTypes.DECIMAL(10, 2), field: "base_price" },
    shelfPrice: { type: DataTypes.DECIMAL(10, 2), field: "shelf_price" },
    promotedPrice: { type: DataTypes.DECIMAL(10, 2), field: "promoted_price" },
  },
  {
    sequelize,
    tableName: "flattened_observations",
    timestamps: false,
    freezeTableName: true,
  }
)
