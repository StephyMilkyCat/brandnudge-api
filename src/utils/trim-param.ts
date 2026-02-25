export const trimParam = (
  q: Record<string, unknown>,
  key: string
): string | undefined => {
  const v = q[key]
  if (typeof v !== "string") return undefined
  const t = v.trim()
  return t === "" ? undefined : t
}
