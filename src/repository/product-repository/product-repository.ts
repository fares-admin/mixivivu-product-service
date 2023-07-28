import { CommonRepository } from 'common-abstract-fares-system'
import { ProductEntity, ProductSchema } from './product-entity'

export class ProductRepository extends CommonRepository<ProductEntity> {
  constructor() {
    super(ProductSchema, 'products')
  }
}
