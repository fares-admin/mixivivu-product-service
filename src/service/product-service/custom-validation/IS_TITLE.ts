import { ProductRepository } from '@/src/repository/product-repository/product-repository'
import { TValidateFunction } from 'common-abstract-fares-system/lib/validation-tool/type-validation'

export const IS_TITLE: TValidateFunction = async <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T,
  params?: any
) => {
  if (!value) {
    return { ...error, [key]: 'required' }
  }
  const repository = new ProductRepository()
  const findTitle = await repository.findOne('title', value)
  if (findTitle.result) {
    if (!!params?.id && params?.id !== findTitle.result._id.toString()) {
      return {
        ...error,
        title: 'title exited',
      }
    }
    if (!params?.id) {
      return {
        ...error,
        title: 'title exited',
      }
    }
  }
  return { ...error, [key]: '' }
}
