import { Cart } from '../../domain/entities/Cart'

export interface CartRepository {
  save(_cart: Cart): Promise<void>
  findById(_id: string): Promise<Cart | null>
  delete(_id: string): Promise<void>
}
