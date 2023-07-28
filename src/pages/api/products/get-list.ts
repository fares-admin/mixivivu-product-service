import { InternalAuthService } from '@/src/service/internal-auth-service/internal-auth-service'
import { ProductService } from '@/src/service/product-service/product-service'
import { wrapperEndpoint } from 'common-abstract-fares-system'
import { NextApiRequest, NextApiResponse } from 'next'

/*
    @ericchen:

    put your explanation here
*/

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const service = new ProductService()
  const internalService = new InternalAuthService()
  const authResult = await internalService.authUserToken(req.headers.authorization || '')
  const isAuth = authResult.success
  const result = await wrapperEndpoint(req, 'GET', service.getListProducts(req, isAuth))
  res.status(200).json(result)
}
