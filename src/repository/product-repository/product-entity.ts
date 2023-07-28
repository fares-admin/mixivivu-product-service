import { OutputData } from '@editorjs/editorjs'
import mongoose from 'mongoose'

export enum TypeDes {
  IMAGE = 'image',
  PARAGRAPH = 'paragraph',
}

export enum TypeProduct {
  SHIP = 'ship',
}

export interface IShipSpec {
  launch: string
  cabin: number
  shell: string
  trip: string
  admin: string
}

export interface IFeature {
  icon: string
  text: string
}
export class ProductEntity {
  _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()

  defaultPrice: number = 0

  category: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()

  title: string = ''

  address: string = ''

  mapLink: string = ''

  mapIframeLink: string = ''

  spec: {
    ship?: IShipSpec
  } = {}

  shortDescription: string[] = []

  features: mongoose.Types.ObjectId[] = []

  longDescription: OutputData = {
    time: 0,
    blocks: [],
    version: '',
  }

  slug: string = ''

  numReviews: number = 0

  scoreReview: number = 0

  typeProduct: TypeProduct = TypeProduct.SHIP

  schedule: string = ''

  active: boolean = true
}

export const ProductSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  defaultPrice: Number,
  category: mongoose.Types.ObjectId,
  title: String,
  address: String,
  mapLink: String,
  mapIframeLink: String,
  spec: {
    ship:
      { launch: String, cabin: Number, shell: String, trip: String, admin: String } || undefined,
  },
  shortDescription: Array<String>,
  features: Array<mongoose.Types.ObjectId>,
  longDescription: Object,
  slug: String,
  numReviews: Number,
  scoreReview: Number,
  typeProduct: String,
  schedule: String,
  active: Boolean,
})
