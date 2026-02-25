#!/usr/bin/env node
import { config } from "dotenv"
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

config({ path: join(root, ".env") })

const [cmd, ...args] = process.argv.slice(2)
const child = spawn(
  cmd ?? "tsx",
  args.length ? args : ["watch", "src/server.ts"],
  {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  }
)
child.on("exit", code => process.exit(code ?? 0))
