import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize"
import { sequelize } from "../../config/database.js"

export class FlattenedProduct extends Model<
  InferAttributes<FlattenedProduct>,
  InferCreationAttributes<FlattenedProduct>
> {
  declare id: string
  declare ean: string
  declare category: string
  declare manufacturer: string
  declare brand: string
  declare productTitle: string
  declare imageUrl: string | null
  declare updatedAt: Date | null
}

FlattenedProduct.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    ean: { type: DataTypes.STRING(20) },
    category: { type: DataTypes.STRING },
    manufacturer: { type: DataTypes.STRING },
    brand: { type: DataTypes.STRING },
    productTitle: { type: DataTypes.STRING(255), field: "product_title" },
    imageUrl: { type: DataTypes.STRING(512), field: "image_url" },
    updatedAt: { type: DataTypes.DATE, field: "updated_at" },
  },
  {
    sequelize,
    tableName: "flattened_products",
    timestamps: false,
    freezeTableName: true,
  }
)
