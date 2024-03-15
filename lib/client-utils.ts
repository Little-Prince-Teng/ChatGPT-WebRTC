import { ref, watch } from 'vue'
import { getLiveKitURL } from './server-utils'

export function useServerUrl(region?: string) {
	const serverUrl = ref()
	watch(() => region, async (newRegion) => {
		console.log('newRegion', newRegion)
		try {
			const url = getLiveKitURL(region)
			serverUrl.value = url
		} catch (error) {
			console.log('error', error)
		}
	}, { immediate: true })
	return serverUrl
}