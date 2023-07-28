import { PublicProductRes } from './product-public-res'

export class PrivateProductRes extends PublicProductRes {
  active: boolean = true
}
