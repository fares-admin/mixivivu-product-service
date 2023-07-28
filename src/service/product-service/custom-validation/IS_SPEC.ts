import { TypeProduct } from '@/src/repository/product-repository/product-entity'
import { validate } from 'common-abstract-fares-system'
import { TValidateFunction } from 'common-abstract-fares-system/lib/validation-tool/type-validation'
import { ShipSpecValidator } from '../product-req'

export const IS_SPEC: TValidateFunction = async <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T,
  params?: any
) => {
  if (!value) {
    return { ...error, [key]: 'required' }
  }
  if (
    params?.typeProduct === TypeProduct.SHIP &&
    value.ship &&
    Object.keys(value.ship).length > 0
  ) {
    const validateShip = await validate(value.ship || {}, ShipSpecValidator)
    if (validateShip.isError) {
      return {
        ...error,
        [key]: {
          ...(error[key as keyof typeof error] as unknown as object),
          ship: validateShip.error,
        },
      }
    }
  }
  return { ...error, [key]: '' }
}
