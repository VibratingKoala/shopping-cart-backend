export type ProductId = {
  readonly value: string
}

export const createProductId = (value: string): ProductId => {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    throw new Error('ProductId must be a non-empty string')
  }

  const trimmed = value.trim()
  if (trimmed.length > 100) {
    throw new Error('ProductId cannot exceed 100 characters')
  }

  return { value: trimmed }
}

export const productIdEquals = (a: ProductId, b: ProductId): boolean => {
  return a.value === b.value
}
