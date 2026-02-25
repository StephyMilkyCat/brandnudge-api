import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize"
import { sequelize } from "../../config/database.js"

export class Manufacturer extends Model<
  InferAttributes<Manufacturer>,
  InferCreationAttributes<Manufacturer>
> {
  declare id: string
  declare name: string
}

Manufacturer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
  },
  { sequelize, tableName: "manufacturers", timestamps: false }
)
