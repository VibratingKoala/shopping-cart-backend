import { Cart } from '../../domain/entities/Cart'

export interface CartRepository {
  save(cart: Cart): Promise<void>
  findById(id: string): Promise<Cart | null>
  delete(id: string): Promise<void>
}