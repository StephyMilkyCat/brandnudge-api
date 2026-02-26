import { Sequelize } from "sequelize"
import { logTimestamp } from "../src/utils/log-timestamp.js"

const host = process.env.PG_HOST
const port = Number(process.env.PG_PORT)
const user = process.env.PG_USER
const password = process.env.PG_PASSWORD
const database = process.env.PG_DATABASE
const debugPostgres = process.env.DEBUG?.includes("postgres") ?? false

export const sequelize = new Sequelize({
  dialect: "postgres",
  host,
  port,
  username: user,
  password: password || undefined,
  database,
  logging: debugPostgres
    ? (sql: string) => console.log(`\n${logTimestamp()} [SQL]`, sql)
    : false,
  define: {
    underscored: false,
    timestamps: false,
  },
})
