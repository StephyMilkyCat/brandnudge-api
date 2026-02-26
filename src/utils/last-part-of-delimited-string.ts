/**
 * Return the last segment of a delimited string (e.g. "A.B.C" with "." → "C").
 */
export const lastPartOfDelimitedString = (
  s: string | undefined,
  delimiter: string
): string | undefined =>
  s == null
    ? undefined
    : delimiter === "" || !s.includes(delimiter)
      ? s
      : s.split(delimiter).pop()!
