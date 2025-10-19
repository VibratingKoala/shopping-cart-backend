export type Money = {
  readonly amount: number
  readonly currency: string
}

export const createMoney = (amount: number, currency = 'USD'): Money => {
  if (!Number.isFinite(amount) || amount < 0) throw new Error('Money amount must be a non-negative finite number')
  return { amount, currency }
}

export const addMoney = (a: Money, b: Money): Money => {
  if (a.currency !== b.currency) throw new Error('Currency mismatch')
  return createMoney(a.amount + b.amount, a.currency)
}
