import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize"
import { sequelize } from "../../config/database.js"

export class SqlInsight extends Model<
  InferAttributes<SqlInsight>,
  InferCreationAttributes<SqlInsight>
> {
  declare id: string
  declare serial: number
  declare description: string | null
  declare sql: string | null
}

SqlInsight.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    serial: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
    },
    description: { type: DataTypes.STRING(1000), allowNull: true },
    sql: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, tableName: "sql_insights", timestamps: false }
)
