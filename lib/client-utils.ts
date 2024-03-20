import { ref, watch } from 'vue'

export function useServerUrl(region?: string) {
	const serverUrl = ref()
	watch(() => region, async (newRegion) => {
		try {
			let endpoint = `/api/url`
			if (newRegion) {
				endpoint += `?region=${newRegion}`
			}
			const res = await fetch(endpoint)
			if (res.ok) {
				const body = await res.json()
				serverUrl.value = body.url
			} else {
				throw Error('Error fetching server url, check server logs')
			}
		} catch (error) {
			console.log('error', error)
		}
	}, { immediate: true })
	return serverUrl
}