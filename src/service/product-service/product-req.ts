import { IShipSpec, TypeProduct } from '@/src/repository/product-repository/product-entity'
import { OutputData } from '@editorjs/editorjs'
import { IS_REQUIRED, ObjectValidator } from 'common-abstract-fares-system'
import { IS_CATEGORY } from './custom-validation/IS_CATEGORY'
import { IS_FEATURE } from './custom-validation/IS_FEATURE'
import { IS_SPEC } from './custom-validation/IS_SPEC'
import { IS_TITLE } from './custom-validation/IS_TITLE'

export class ProductRequest {
  defaultPrice: number = 0

  category: string = ''

  title: string = ''

  address: string = ''

  mapLink: string = ''

  mapIframeLink: string = ''

  spec: {
    ship?: IShipSpec
  } = {}

  shortDescription: string[] = []

  features: string[] = []

  longDescription: OutputData = {
    time: 0,
    blocks: [],
    version: '',
  }

  slug: string = ''

  schedule: string = ''

  typeProduct: TypeProduct = TypeProduct.SHIP
}

export type ProductRequestError = {
  defaultPrice: string
  title: string
  address: string
  mapLink: string
  mapIframeLink: string
  category: string
  spec: {
    ship?: {
      launch: string
      cabin: string
      shell: string
      trip: string
      admin: string
    }
  }
  shortDescription: string
  features: string
  longDescription: string
  typeProduct: string
  schedule: string
  slug: string
}

export const ProductRequestValidator: ObjectValidator<ProductRequestError> = {
  category: IS_CATEGORY,
  title: IS_TITLE,
  spec: IS_SPEC,
  address: IS_REQUIRED,
  mapLink: IS_REQUIRED,
  shortDescription: IS_REQUIRED,
  features: IS_FEATURE,
  longDescription: IS_REQUIRED,
  typeProduct: IS_REQUIRED,
  defaultPrice: IS_REQUIRED,
  schedule: IS_REQUIRED,
  slug: IS_REQUIRED,
  mapIframeLink: IS_REQUIRED,
}

export const ShipSpecValidator: ObjectValidator<IShipSpec> = {
  launch: IS_REQUIRED,
  cabin: IS_REQUIRED,
  shell: IS_REQUIRED,
  trip: IS_REQUIRED,
  admin: IS_REQUIRED,
}
