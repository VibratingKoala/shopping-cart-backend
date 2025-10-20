import { describe, it, expect } from 'vitest'
import { createProductId, productIdEquals } from './ProductId'

describe('ProductId value object', () => {
  it('creates valid ProductId with string value', () => {
    const productId = createProductId('product-123')
    expect(productId.value).toBe('product-123')
  })

  it('trims whitespace from ProductId value', () => {
    const productId = createProductId('  product-456  ')
    expect(productId.value).toBe('product-456')
  })

  it('throws on empty string', () => {
    expect(() => createProductId('')).toThrow('ProductId must be a non-empty string')
  })

  it('throws on whitespace-only string', () => {
    expect(() => createProductId('   ')).toThrow('ProductId must be a non-empty string')
  })

  it('throws on non-string input', () => {
    expect(() => createProductId(123 as any)).toThrow('ProductId must be a non-empty string')
    expect(() => createProductId(null as any)).toThrow('ProductId must be a non-empty string')
    expect(() => createProductId(undefined as any)).toThrow('ProductId must be a non-empty string')
  })

  it('throws on excessively long ProductId', () => {
    const longId = 'a'.repeat(101)
    expect(() => createProductId(longId)).toThrow('ProductId cannot exceed 100 characters')
  })

  it('allows ProductId up to 100 characters', () => {
    const maxLengthId = 'a'.repeat(100)
    const productId = createProductId(maxLengthId)
    expect(productId.value).toBe(maxLengthId)
  })

  it('correctly compares ProductIds for equality', () => {
    const id1 = createProductId('product-123')
    const id2 = createProductId('product-123')
    const id3 = createProductId('product-456')

    expect(productIdEquals(id1, id2)).toBe(true)
    expect(productIdEquals(id1, id3)).toBe(false)
  })
})
