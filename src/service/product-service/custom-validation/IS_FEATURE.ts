import axios from 'axios'
import { CommonResponse, generateServiceToken } from 'common-abstract-fares-system'
import { TValidateFunction } from 'common-abstract-fares-system/lib/validation-tool/type-validation'
import mongoose from 'mongoose'

export const IS_FEATURE: TValidateFunction = async <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T
) => {
  if (!value || !Array.isArray(value)) {
    return {
      ...error,
      features: 'features invalid',
    }
  }
  const features = Array(value)
  const resultGet = await Promise.all(
    features.map(async (item) => {
      if (!mongoose.isValidObjectId(item)) {
        return {}
      }
      const internalToken = generateServiceToken({ serviceName: process.env.SERVICE_NAME || '' })
      const callInternalProduct = await axios.get(
        `${process.env.FEATURE_SERVICE_URL}/api/service/find-feature?id=${value}&ServiceToken=${internalToken}`
      )
      if (callInternalProduct.status !== 200) return {}
      const result = callInternalProduct.data as CommonResponse<any>
      if (!result.success) {
        return {}
      }
      return item
    })
  )

  if (resultGet.filter((item) => Object.keys(item).length === 0).length > 0) {
    return {
      ...error,
      features: 'features invalid',
    }
  }

  return { ...error, [key]: '' }
}
