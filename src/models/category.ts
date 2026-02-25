import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize"
import { sequelize } from "../../config/database.js"

export class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  declare id: string
  declare parentId: string | null
  declare name: string
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "parent_id",
      references: { model: "categories", key: "id" },
    },
    name: { type: DataTypes.STRING(200), allowNull: false },
  },
  { sequelize, tableName: "categories", timestamps: false }
)

Category.belongsTo(Category, { as: "parent", foreignKey: "parentId" })
Category.hasMany(Category, { as: "children", foreignKey: "parentId" })
