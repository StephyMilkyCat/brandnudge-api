import { Client } from "@elastic/elasticsearch"
import {
  Transport,
  type TransportRequestParams,
  type TransportRequestOptions,
} from "@elastic/transport"
import { logTimestamp } from "../src/utils/log-timestamp.js"

const esHost = process.env.ES_HOST
const esPort = Number(process.env.ES_PORT)
const esUser = process.env.ES_USER
const esPassword = process.env.ES_PASSWORD
const node =
  esUser && esPassword
    ? `http://${esUser}:${esPassword}@${esHost}:${esPort}`
    : `http://${esHost}:${esPort}`

const debugElasticsearch = process.env.DEBUG?.includes("elasticsearch") ?? false

class LoggingTransport extends Transport {
  request<TResponse = unknown>(
    params: TransportRequestParams,
    options?: TransportRequestOptions
  ): Promise<TResponse> {
    const method = params.method ?? "GET"
    const path = params.path ?? ""
    const body = params.body
    const qs = params.querystring
    const label = body != null ? "body" : qs != null ? "querystring" : null
    const payload = body ?? qs
    const ts = `${logTimestamp()} [ES]`
    if (label && payload !== undefined) {
      console.log("\n" + ts, method, path, label + ":")
      console.dir(payload, { depth: null })
    } else {
      console.log("\n" + ts, method, path)
    }
    return super.request(params, options) as Promise<TResponse>
  }
}

export const esClient = new Client({
  node,
  ...(debugElasticsearch && {
    Transport: LoggingTransport as typeof Transport,
  }),
})
