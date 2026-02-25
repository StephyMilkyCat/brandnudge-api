import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize"
import { sequelize } from "../../config/database.js"
import { Manufacturer } from "./manufacturer.js"

export class Brand extends Model<
  InferAttributes<Brand>,
  InferCreationAttributes<Brand>
> {
  declare id: string
  declare manufacturerId: string
  declare name: string
}

Brand.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    manufacturerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "manufacturer_id",
      references: { model: "manufacturers", key: "id" },
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
  },
  { sequelize, tableName: "brands", timestamps: false }
)

Brand.belongsTo(Manufacturer, { foreignKey: "manufacturerId" })
Manufacturer.hasMany(Brand, { foreignKey: "manufacturerId" })
