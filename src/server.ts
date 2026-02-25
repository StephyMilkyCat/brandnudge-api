import app from "./app.js"
import { initModels } from "./models/index.js"

await initModels()
const port = Number(process.env.PORT) || 3000
const host = process.env.HOST ?? "127.0.0.1"
const server = app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`)
})
export default server
