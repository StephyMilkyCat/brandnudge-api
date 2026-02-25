declare module "koa-router" {
  import type { Context } from "koa"
  interface RouterOptions {
    prefix?: string
  }
  interface IRouterParamContext {
    (ctx: Context, next: () => Promise<void>): Promise<void>
  }
  class Router {
    constructor(options?: RouterOptions)
    get(path: string, ...handlers: IRouterParamContext[]): this
    post(path: string, ...handlers: IRouterParamContext[]): this
    put(path: string, ...handlers: IRouterParamContext[]): this
    routes(): (ctx: Context, next: () => Promise<void>) => Promise<void>
    allowedMethods(): (ctx: Context, next: () => Promise<void>) => Promise<void>
  }
  export = Router
}
