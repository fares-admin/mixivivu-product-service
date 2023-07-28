import { ProductEntity } from '@/src/repository/product-repository/product-entity'
import { ProductRepository } from '@/src/repository/product-repository/product-repository'
import { CommonResponse, convertValue, validateServiceToken } from 'common-abstract-fares-system'
import mongoose from 'mongoose'

export const findInternalProductFunction = async (
  serviceToken: string,
  repository: ProductRepository,
  productId: string
): Promise<CommonResponse<ProductEntity | string>> => {
  try {
    const { serviceName } = validateServiceToken(serviceToken.split(' ')[1])
    if (!serviceName) {
      return {
        status: 500,
        message: 'invalid token',
        success: false,
        result: '',
      }
    }
    const serviceAccess = process.env.ACCESS_SCOPE?.split(',')
    if (!serviceAccess?.includes(serviceName)) {
      return {
        status: 500,
        message: 'no access',
        success: false,
        result: '',
      }
    }
  } catch (err) {
    return {
      status: 500,
      message: String(err),
      success: false,
      result: '',
    }
  }
  try {
    const findProduct = await repository.findOne('_id', new mongoose.Types.ObjectId(productId))
    if (findProduct.error) {
      return {
        status: 401,
        message: String(findProduct.error),
        success: false,
        result: '',
      }
    }
    if (!findProduct.result) {
      return {
        status: 401,
        message: 'invalid user',
        success: false,
        result: '',
      }
    }
    return {
      status: 200,
      success: true,
      message: 'valid',
      result: convertValue(findProduct.result, new ProductEntity()),
    }
  } catch (err) {
    return {
      status: 401,
      message: String(err),
      success: false,
      result: '',
    }
  }
}
