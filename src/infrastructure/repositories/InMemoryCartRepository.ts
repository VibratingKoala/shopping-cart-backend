import { Cart } from '../../domain/entities/Cart'
import { CartRepository } from '../../application/ports/CartRepository'

export class InMemoryCartRepository implements CartRepository {
  private readonly carts = new Map<string, Cart>()

  async save(cart: Cart): Promise<void> {
    this.carts.set(cart.id, cart)
  }

  async findById(id: string): Promise<Cart | null> {
    return this.carts.get(id) || null
  }

  async delete(id: string): Promise<void> {
    this.carts.delete(id)
  }

  // Additional methods for testing and debugging
  async clear(): Promise<void> {
    this.carts.clear()
  }

  async count(): Promise<number> {
    return this.carts.size
  }

  async findAll(): Promise<Cart[]> {
    return Array.from(this.carts.values())
  }
}