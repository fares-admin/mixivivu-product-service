import { CommonResponse, validateServiceToken } from 'common-abstract-fares-system'

import { ProductEntity } from '@/src/repository/product-repository/product-entity'
import { ProductRepository } from '@/src/repository/product-repository/product-repository'
import mongoose from 'mongoose'
import { ProductRequestError } from '../product-req'

/*
      @ericchen:
  
      put your explanation here
  */

export const updateReviewScoreFunction = async (
  score: number,
  numReview: number,
  repository: ProductRepository,
  id: string,
  serviceToken: string
): Promise<CommonResponse<ProductRequestError | string>> => {
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
  const res = {
    success: false,
    message: '',
    result: '',
    status: 400,
  }
  if (!id || !mongoose.isValidObjectId(id)) {
    return {
      ...res,
      message: 'invalid id',
    }
  }
  const findId = await repository.findOne('_id', new mongoose.Types.ObjectId(id))
  if (!findId.result) {
    return {
      ...res,
      message: 'not found product',
      status: 404,
    }
  }
  const entity: ProductEntity = {
    ...findId.result,
    scoreReview: score,
    numReviews: numReview,
  }
  const { error } = await repository.update([{ ...entity }])
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
