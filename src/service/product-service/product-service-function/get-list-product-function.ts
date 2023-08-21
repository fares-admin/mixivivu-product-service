import {
  CommonListResult,
  CommonResponse,
  generateServiceToken,
} from 'common-abstract-fares-system'

import { NextApiRequest } from 'next'
import { PrivateProductRes } from '../product-private-res'
import { ProductRepository } from '@/src/repository/product-repository/product-repository'
import { PublicProductRes } from '../product-public-res'
import axios from 'axios'
import mongoose from 'mongoose'

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
            catalogs: res.data.map((item) => item.link),
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
        mapLink: item.mapLink === 'a' ? 'https://goo.gl/maps/6mQDuQWa4Ybq6K5p8' : item.mapLink,
        mapIframeLink:
          item.mapIframeLink === 'b'
            ? 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1863.1732009329894!2d106.9873709!3d20.9385997!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a5ed92d2389b5%3A0x21301374c6ce99a2!2zRHUgVGh1eeG7gW4gTWFyZ2FyZXQgSOG6oSBMb25n!5e0!3m2!1sen!2s!4v1692608989957!5m2!1sen!2s'
            : item.mapIframeLink,
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
