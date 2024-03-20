import express, { Request, Response } from 'express'
import { getLiveKitURL } from '../../lib/server-utils'

const urlRouter = express.Router()

urlRouter.get('/', (req: Request, res: Response) => {
	try {
		const { region } = req.query

		if (Array.isArray(region)) {
			throw Error('provide max one region string')
		}
		const url = getLiveKitURL(region)
		res.status(200).json({ url })
	} catch (e) {
		res.status(500).json({ error: (e as Error).message })
	}
})

export default urlRouter