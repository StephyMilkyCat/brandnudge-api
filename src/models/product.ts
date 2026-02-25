import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize"
import { sequelize } from "../../config/database.js"
import { Brand } from "./brand.js"
import { Category } from "./category.js"
import { Manufacturer } from "./manufacturer.js"

export class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: string
  declare ean: string
  declare categoryId: string
  declare manufacturerId: string
  declare brandId: string
  declare productTitle: string
  declare imageUrl: string | null
  declare updatedAt: Date
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ean: { type: DataTypes.STRING(20), allowNull: false },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "category_id",
      references: { model: "categories", key: "id" },
    },
    manufacturerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "manufacturer_id",
      references: { model: "manufacturers", key: "id" },
    },
    brandId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "brand_id",
      references: { model: "brands", key: "id" },
    },
    productTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "product_title",
    },
    imageUrl: {
      type: DataTypes.STRING(512),
      allowNull: true,
      field: "image_url",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "updated_at",
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: "products", timestamps: false }
)

Product.belongsTo(Brand, { foreignKey: "brandId" })
Product.belongsTo(Category, { foreignKey: "categoryId" })
Product.belongsTo(Manufacturer, { foreignKey: "manufacturerId" })
