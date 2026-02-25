export const ENTITIES_INDEX = "entities"
export const PRODUCTS_INDEX = "products"

/** Entity document from ES entities index (_source), e.g. type="retailer". */
export type EsEntitySource = { type: string; name: string }

/** Product document from ES products index (_source). */
export type EsProductSource = {
  ean?: string
  retailer?: string
  category?: string
  manufacturer?: string
  brand?: string
  product_title?: string
  image_url?: string | null
}

export const autocompleteAnalyzer = {
  type: "custom",
  tokenizer: "standard",
  filter: ["lowercase", "edge_ngram_filter"],
}

export const edgeNgramFilter = {
  type: "edge_ngram",
  min_gram: 2,
  max_gram: 20,
}

export const entitiesIndexBody = {
  settings: {
    analysis: {
      analyzer: {
        autocomplete_analyzer: autocompleteAnalyzer,
      },
      filter: {
        edge_ngram_filter: edgeNgramFilter,
      },
    },
  },
  mappings: {
    properties: {
      type: { type: "keyword" },
      name: {
        type: "text",
        fields: {
          keyword: { type: "keyword" },
          suggest: {
            type: "text",
            analyzer: "autocomplete_analyzer",
            search_analyzer: "standard",
          },
          fuzzy: { type: "text", analyzer: "standard" },
        },
      },
    },
  },
}

export const productsIndexBody = {
  settings: {
    analysis: {
      analyzer: {
        autocomplete_analyzer: autocompleteAnalyzer,
      },
      filter: {
        edge_ngram_filter: edgeNgramFilter,
      },
    },
  },
  mappings: {
    properties: {
      product_title: {
        type: "text",
        fields: {
          keyword: { type: "keyword" },
          suggest: {
            type: "text",
            analyzer: "autocomplete_analyzer",
            search_analyzer: "standard",
          },
          fuzzy: { type: "text", analyzer: "standard" },
        },
      },
      ean: { type: "keyword" },
      category: {
        type: "text",
        fields: {
          keyword: { type: "keyword" },
          suggest: {
            type: "text",
            analyzer: "autocomplete_analyzer",
            search_analyzer: "standard",
          },
          fuzzy: { type: "text", analyzer: "standard" },
        },
      },
      manufacturer: {
        type: "text",
        fields: {
          keyword: { type: "keyword" },
          suggest: {
            type: "text",
            analyzer: "autocomplete_analyzer",
            search_analyzer: "standard",
          },
          fuzzy: { type: "text", analyzer: "standard" },
        },
      },
      brand: {
        type: "text",
        fields: {
          keyword: { type: "keyword" },
          suggest: {
            type: "text",
            analyzer: "autocomplete_analyzer",
            search_analyzer: "standard",
          },
          fuzzy: { type: "text", analyzer: "standard" },
        },
      },
      // retailer: {
      //   type: "text",
      //   fields: {
      //     keyword: { type: "keyword" },
      //     suggest: {
      //       type: "text",
      //       analyzer: "autocomplete_analyzer",
      //       search_analyzer: "standard",
      //     },
      //     fuzzy: { type: "text", analyzer: "standard" },
      //   },
      // },
      image_url: { type: "keyword", index: false },
      updated_at: { type: "date" },
    },
  },
}
