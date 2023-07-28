import { ProductRepository } from '@/src/repository/product-repository/product-repository'
import { CommonListResult, CommonResponse } from 'common-abstract-fares-system'
import mongoose from 'mongoose'
import { NextApiRequest } from 'next'
import { PrivateProductRes } from '../product-private-res'
import { PublicProductRes } from '../product-public-res'

/*
      @ericchen:
  
      put your explanation here
  */

export const getListProductFunc = async (
  req: NextApiRequest,
  repository: ProductRepository,
  getPageAndSize: (req: {
    query: {
      page: number
      size: number
    }
  }) => {
    page: number
    size: number
  },
  pipeLine: mongoose.PipelineStage[],
  isAuth: boolean
): Promise<CommonResponse<CommonListResult<PublicProductRes | PrivateProductRes> | string>> => {
  const { page, size } = getPageAndSize(req as any)
  const result = await repository.find(page, size, pipeLine)
  if (!result.result) {
    return {
      status: 500,
      message: 'sv err',
      success: false,
      result: '',
    }
  }
  if (isAuth) {
    return {
      status: 200,
      message: 'ok',
      success: true,
      result: {
        ...result.result,
        data: result.result.data.map((item) => {
          return {
            ...item,
            _id: item._id.toString(),
            category: item.category.toString(),
            features: item.features.map((item) => item.toString()),
          }
        }),
      },
    }
  }
  return {
    status: 200,
    message: 'ok',
    success: true,
    result: {
      ...result.result,
      data: result.result.data.map((item) => {
        return {
          ...item,
          _id: item._id.toString(),
          category: item.category.toString(),
          features: item.features.map((item) => item.toString()),
          active: undefined,
        }
      }),
    },
  }
}
