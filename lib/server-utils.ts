// import { RoomServiceClient } from 'livekit-server-sdk'
import { loadEnv } from 'vite'

// export function getRoomClient(): RoomServiceClient {
// 	checkKeys();
// 	return new RoomServiceClient(getLiveKitURL())
// }
const mode = 'development'
const env = loadEnv(mode, process.cwd())

export function getLiveKitURL(region?: string | string[] | any): string {
	let targetKey = 'VITE_LIVEKIT_URL'
	if (region && !Array.isArray(region)) {
		targetKey = `VITE_LIVEKIT_URL_${region}`.toUpperCase()
	}
	// const url = import.meta.env[targetKey]
	const url = env[targetKey]
	if (!url) {
		throw new Error(`${targetKey} is not defined`)
	}
	return url
}

// function checkKeys() {
// 	if (typeof process.env.LIVEKIT_API_KEY === 'undefined') {
// 		throw new Error('VITE_LIVEKIT_API_KEY is not defined')
// 	}
// 	if (typeof process.env.LIVEKIT_API_SECRET === 'undefined') {
// 		throw new Error('VITE_LIVEKIT_API_SECRET is not defined')
// 	}
// }