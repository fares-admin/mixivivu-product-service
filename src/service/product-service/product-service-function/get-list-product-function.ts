import {
  CommonListResult,
  CommonResponse,
  generateServiceToken,
} from 'common-abstract-fares-system'

import { ProductRepository } from '@/src/repository/product-repository/product-repository'
import axios from 'axios'
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
  const responseList = await Promise.all(
    result.result.data.map(async (item) => {
      const internalToken = generateServiceToken({ serviceName: process.env.SERVICE_NAME || '' })
      const callInternalImage = await axios.get(
        `${
          process.env.IMAGE_SERVICE_URL
        }/api/images/get-list?belongIds=${item._id.toString()}&ServiceToken=${internalToken}`
      )
      if (callInternalImage.status === 200 && callInternalImage.data.success) {
        const res = callInternalImage.data.result as CommonListResult<any>
        if (res.data.length > 0) {
          return {
            ...item,
            _id: item._id.toString(),
            category: item.category.toString(),
            features: item.features.map((item) => item.toString()),
            thumbnail: res.data[0].link,
            catalogs: res.data.filter((item, index) => index > 0).map((item) => item.link),
          }
        }
      }

      return {
        ...item,
        _id: item._id.toString(),
        category: item.category.toString(),
        features: item.features.map((item) => item.toString()),
        thumbnail: '',
        catalogs: [],
      }
    })
  )
  if (isAuth) {
    return {
      status: 200,
      message: 'ok',
      success: true,
      result: {
        ...result.result,
        data: responseList,
      },
    }
  }
  return {
    status: 200,
    message: 'ok',
    success: true,
    result: {
      ...result.result,
      data: responseList.map((item) => {
        return {
          ...item,
          active: undefined,
        }
      }),
    },
  }
}
