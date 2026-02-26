/** Category-like shape needed to build a path (name + parentId). */
export interface CategoryLike {
  name: string
  parentId: string | null
}

/**
 * Build "Parent Category Name.Category Name" by walking up the category tree.
 */
export const getCategoryPathName = (
  category: CategoryLike,
  byId: Map<string, CategoryLike>
): string => {
  const parts: string[] = []
  let current: CategoryLike | undefined = category
  while (current) {
    parts.unshift(current.name)
    current = current.parentId ? byId.get(current.parentId) : undefined
  }
  return parts.join(".")
}
