import { IShipSpec, TypeProduct } from '@/src/repository/product-repository/product-entity'
import { OutputData } from '@editorjs/editorjs'

export class PublicProductRes {
  _id: string = ''

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

  numReviews: number = 0

  scoreReview: number = 0

  typeProduct: TypeProduct = TypeProduct.SHIP
}
