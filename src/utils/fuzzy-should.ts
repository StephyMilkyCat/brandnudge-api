/**
 * Build an Elasticsearch bool should clause for a field with .suggest and .fuzzy subfields.
 */
export const fuzzyShould = (
  field: string,
  value: string
): Record<string, unknown> => {
  const suggestKey = `${field}.suggest`
  const fuzzyKey = `${field}.fuzzy`
  return {
    bool: {
      should: [
        {
          match: { [suggestKey]: { query: value, boost: 3, operator: "and" } },
        },
        {
          match: {
            [fuzzyKey]: {
              query: value,
              fuzziness: "AUTO",
              boost: 1,
              operator: "and",
            },
          },
        },
      ],
      minimum_should_match: 1,
    },
  }
}
