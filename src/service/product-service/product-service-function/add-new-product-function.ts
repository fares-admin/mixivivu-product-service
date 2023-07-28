import { ProductEntity } from '@/src/repository/product-repository/product-entity'
import { ProductRepository } from '@/src/repository/product-repository/product-repository'
import { CommonResponse, validate } from 'common-abstract-fares-system'
import mongoose from 'mongoose'
import { ProductRequest, ProductRequestError, ProductRequestValidator } from '../product-req'

/*
    @ericchen:

    put your explanation here
*/

export const addNewProductFunction = async (
  req: ProductRequest,
  repository: ProductRepository
): Promise<CommonResponse<ProductRequestError | string>> => {
  const validateRes = await validate(req, ProductRequestValidator, { typeProduct: req.typeProduct })
  if (validateRes.isError) {
    return {
      success: false,
      result: {
        ...(validateRes.error as any),
      },
      message: 'invalidRequest',
      status: 400,
    }
  }
  const entity: ProductEntity = {
    ...new ProductEntity(),
    ...req,
    features: req.features
      .filter((item) => mongoose.isValidObjectId(item))
      .map((item) => new mongoose.Types.ObjectId(item)),
    category: new mongoose.Types.ObjectId(req.category),
    typeProduct: req.typeProduct,
  }
  const { error } = await repository.insert([{ ...entity }])
  if (error) {
    return {
      status: 500,
      message: error || '',
      result: '',
      success: false,
    }
  }
  return {
    status: 200,
    message: 'ok',
    result: '',
    success: true,
  }
}
