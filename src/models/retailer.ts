import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize"
import { sequelize } from "../../config/database.js"

export class Retailer extends Model<
  InferAttributes<Retailer>,
  InferCreationAttributes<Retailer>
> {
  declare id: string
  declare name: string
}

Retailer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
  },
  { sequelize, tableName: "retailers", timestamps: false }
)
