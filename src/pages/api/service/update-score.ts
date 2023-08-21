import { NextApiRequest, NextApiResponse } from 'next'

import { ProductService } from '@/src/service/product-service/product-service'
import { wrapperEndpoint } from 'common-abstract-fares-system'

/*
    @ericchen:

    put your explanation here
*/

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const service = new ProductService()
  const result = await wrapperEndpoint(
    req,
    'GET',
    service.updateProductScore(
      req.query.id?.toString() || '',
      req.query.ServiceToken?.toString() || '',
      Number(req.query.score),
      Number(req.query.num)
    )
  )
  res.status(200).json(result)
}
