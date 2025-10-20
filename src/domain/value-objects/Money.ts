export type Money = {
  readonly amount: number
  readonly currency: string
}

export const createMoney = (amount: number, currency = 'USD'): Money => {
  if (!Number.isFinite(amount) || amount < 0) throw new Error('Money amount must be a non-negative finite number')
  // Round to 2 decimal places to avoid floating point precision issues
  const roundedAmount = Math.round(amount * 100) / 100
  return { amount: roundedAmount, currency }
}

export const addMoney = (a: Money, b: Money): Money => {
  if (a.currency !== b.currency) throw new Error('Currency mismatch')
  return createMoney(a.amount + b.amount, a.currency)
}
