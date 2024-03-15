import { RoomServiceClient } from 'livekit-server-sdk'

export function getRoomClient(): RoomServiceClient {
	checkKeys();
	return new RoomServiceClient(getLiveKitURL())
}

export function getLiveKitURL(region?: string | string[]): string {
	let targetKey = 'VITE_LIVEKIT_URL'
	if (region && !Array.isArray(region)) {
		targetKey = `VITE_LIVEKIT_URL_${region}`.toUpperCase()
	}
	const url = import.meta.env[targetKey]
	if (!url) {
		throw new Error(`${targetKey} is not defined`)
	}
	return url
}

function checkKeys() {
	if (typeof import.meta.env.LIVEKIT_API_KEY === 'undefined') {
		throw new Error('VITE_LIVEKIT_API_KEY is not defined')
	}
	if (typeof import.meta.env.LIVEKIT_API_SECRET === 'undefined') {
		throw new Error('VITE_LIVEKIT_API_SECRET is not defined')
	}
}