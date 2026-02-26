const LIGHT_GREEN = "\x1b[92m"
const RESET = "\x1b[0m"

export const logTimestampPlain = (): string => {
  const now = new Date()
  const Y = now.getFullYear()
  const M = String(now.getMonth() + 1).padStart(2, "0")
  const D = String(now.getDate()).padStart(2, "0")
  const h = String(now.getHours()).padStart(2, "0")
  const m = String(now.getMinutes()).padStart(2, "0")
  const s = String(now.getSeconds()).padStart(2, "0")
  const ms = String(now.getMilliseconds()).padStart(3, "0")
  return `${Y}-${M}-${D} ${h}:${m}:${s}.${ms}`
}

/** Timestamp string styled for console (light green). */
export const logTimestamp = (): string =>
  `${LIGHT_GREEN}[${logTimestampPlain()}]${RESET}`
