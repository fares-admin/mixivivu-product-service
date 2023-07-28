import axios from 'axios'
import { CommonResponse, generateServiceToken } from 'common-abstract-fares-system'
import { TValidateFunction } from 'common-abstract-fares-system/lib/validation-tool/type-validation'
import mongoose from 'mongoose'

export const IS_CATEGORY: TValidateFunction = async <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T
) => {
  if (!value || !mongoose.isValidObjectId(value)) {
    return {
      ...error,
      category: 'category invalid',
    }
  }
  const internalToken = generateServiceToken({ serviceName: process.env.SERVICE_NAME || '' })
  const callInternalProduct = await axios.get(
    `${process.env.CATEGORY_SERVICE_URL}/api/service/find-category?id=${value}&ServiceToken=${internalToken}`
  )
  if (callInternalProduct.status !== 200)
    return {
      ...error,
      category: 'category invalid',
    }
  const result = callInternalProduct.data as CommonResponse<any>
  if (!result.success) {
    return {
      ...error,
      category: 'category invalid',
    }
  }
  return { ...error, [key]: '' }
}
