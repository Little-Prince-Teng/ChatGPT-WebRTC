import express, { Request, Response } from 'express'
import { loadEnv } from 'vite'
import { AccessToken } from 'livekit-server-sdk'
import type { AccessTokenOptions, VideoGrant } from 'livekit-server-sdk'
import { TokenResult } from '../../lib/types'

const tokenRouter = express.Router()
const env = loadEnv('development', process.cwd())
const apiKey = env.VITE_LIVEKIT_API_KEY
const apiSecret = env.VITE_LIVEKIT_API_SECRET

const createToken = (userInfo: AccessTokenOptions, grant: VideoGrant) => {
	const at = new AccessToken(apiKey, apiSecret, userInfo)
	at.ttl = '5m'
	at.addGrant(grant)
	return at.toJwt()
}

tokenRouter.get('/', async (req: Request, res: Response) => {
	try {
		const { roomName, identity, name, metadata } = req.query
		if (typeof identity !== 'string' || typeof roomName !== 'string') {
			res.status(403).end()
			return
		}

		if (Array.isArray(name)) {
			throw Error('provide max one name')
		}
		if (Array.isArray(metadata)) {
			throw Error('provide max one metadata string')
		}

		const grant: VideoGrant = {
			room: roomName,
			roomJoin: true,
			canPublish: true,
			canPublishData: true,
			canSubscribe: true,
		}

		const token = await createToken({ identity }, grant)
		const result: TokenResult = {
			identity,
			accessToken: token,
		}

		res.status(200).json(result)
	} catch (e) {
		res.statusMessage = (e as Error).message
		res.status(500).end()
	}
})

export default tokenRouter