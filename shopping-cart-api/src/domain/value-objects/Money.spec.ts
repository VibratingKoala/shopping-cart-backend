import { describe, it, expect } from 'vitest'
import { createMoney, addMoney } from './Money'

describe('Money value object', () => {
  it('creates money and enforces non-negative', () => {
    const m = createMoney(10, 'USD')
    expect(m.amount).toBe(10)
    expect(m.currency).toBe('USD')
  })

  it('throws on negative amount', () => {
    expect(() => createMoney(-1)).toThrow()
  })

  it('adds money with same currency', () => {
    const a = createMoney(5, 'USD')
    const b = createMoney(7, 'USD')
    const sum = addMoney(a, b)
    expect(sum.amount).toBe(12)
    expect(sum.currency).toBe('USD')
  })

  it('throws on currency mismatch', () => {
    const a = createMoney(1, 'USD')
    const b = createMoney(1, 'EUR')
    expect(() => addMoney(a, b)).toThrow()
  })
})
