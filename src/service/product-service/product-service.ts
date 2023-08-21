import { CommonListResult, CommonResponse, CommonService } from 'common-abstract-fares-system'
import { ProductRequest, ProductRequestError } from './product-req'
import {
  addNewProductFunction,
  deleteProductFunction,
  findInternalProductFunction,
  getListProductFunc,
  updateProductFunction,
} from './product-service-function'

import { ProductEntity } from '@/src/repository/product-repository/product-entity'
import { ProductRepository } from '@/src/repository/product-repository/product-repository'
import { NextApiRequest } from 'next'
import { PrivateProductRes } from './product-private-res'
import { PublicProductRes } from './product-public-res'
import { updateReviewScoreFunction } from './product-service-function/update-review-score'

export class ProductService extends CommonService<ProductRepository> {
  constructor() {
    super(new ProductRepository())
  }

  public async getListProducts(
    req: NextApiRequest,
    isAuth: boolean
  ): Promise<CommonResponse<CommonListResult<PublicProductRes | PrivateProductRes> | string>> {
    return await getListProductFunc(
      req,
      this.repository,
      this.getPageAndSize,
      this.generatePipelineAggregate(req.query, new ProductEntity()),
      isAuth
    )
  }

  public async addNewProduct(
    req: ProductRequest
  ): Promise<CommonResponse<ProductRequestError | string>> {
    return await addNewProductFunction(req, this.repository)
  }

  public async deleteProduct(ids: string): Promise<CommonResponse<string>> {
    return await deleteProductFunction(ids, this.repository)
  }

  public async updateProduct(
    id: string,
    req: ProductRequest
  ): Promise<CommonResponse<ProductRequestError | string>> {
    return await updateProductFunction(req, this.repository, id)
  }

  public async updateProductScore(
    id: string,
    serviceToken: string,
    score: number,
    numReview: number
  ): Promise<CommonResponse<ProductRequestError | string>> {
    return await updateReviewScoreFunction(score, numReview, this.repository, id, serviceToken)
  }

  public async getInternalProduct(
    id: string,
    serviceToken: string
  ): Promise<CommonResponse<ProductEntity | string>> {
    return await findInternalProductFunction(serviceToken, this.repository, id)
  }
}
