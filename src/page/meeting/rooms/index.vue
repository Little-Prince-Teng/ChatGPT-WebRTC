<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
	LiveKitRoom,
	VideoConference,
	LocalUserChoices,
	formatChatMessageLinks,
	useToken
} from '@livekit/components-react'
import {
	Room,
	RoomOptions,
	RoomConnectOptions,
	VideoCodec,
  VideoPresets,
} from 'livekit-client'
import { applyPureReactInVue, createCrossingProviderForPureVueInReact } from 'veaury'
import { useServerUrl } from '../../../../lib/client-utils'


const VideoMeeting = applyPureReactInVue(VideoConference)

interface Props {
	userChoices: LocalUserChoices,
	roomName: string,
	onLeave?: () => void
}
const props = defineProps<Props>()

const router = useRouter()
const { hq, region, codec } = router.currentRoute.value.query
const meetingUrl = useServerUrl(region as string | undefined)
const meetingToken = ref()
const tokenOptions = computed(() => {
	return {
		userInfo: {
			identity: props.userChoices.username,
			name: props.userChoices.username
		}
	}
})

// 创建一个跨技术栈到vue的react hooks和一个对应使用的react provider
const [useHooksInVue, HooksProvider] = createCrossingProviderForPureVueInReact(
	() => {
		return {
			// 将前面创建的React context的值暴露给vue，使用useContext hooks
			token: useToken(import.meta.env.VITE_PUBLIC_LK_TOKEN_ENDPOINT, props.roomName, tokenOptions.value)
		}
	}
)
// 将HooksProvider转换为vue组件
const VueMissReact = applyPureReactInVue(HooksProvider)
const Meeting = applyPureReactInVue(LiveKitRoom, {
	async useInjectPropsFromWrapper() {
		const { token } = await useHooksInVue()
		meetingToken.value = token
		return {
			token
		}
	}
})

const roomOptions = computed<RoomOptions>(() => {
	const videoCodec: VideoCodec | undefined = (
		Array.isArray(codec) ? codec[0] : codec ?? 'vp9'
	) as VideoCodec
	return {
		videoCaptureDefaults: {
			deviceId: props.userChoices?.videoDeviceId ?? undefined,
			resolution: hq === 'true' ? VideoPresets.h2160 : VideoPresets.h720
		},
		publishDefaults: {
			dtx: true,
			videoSimulcastLayers:
				hq === 'true'
					? [VideoPresets.h1080, VideoPresets.h720]
					: [VideoPresets.h540, VideoPresets.h216],
			videoCodec
		},
		audioCaptureDefaults: {
			deviceId: props.userChoices?.audioDeviceId ?? undefined
		},
		adaptiveStream: { pixelDensity: 'screen' },
		dynacast: true,
	}
})
const connectOptions = computed<RoomConnectOptions>(() => {
	return {
		autoSubscribe: true
	}
})
const room = new Room(roomOptions.value)
</script>

<template>
<VueMissReact>
	<Meeting
		:room="room"
		:token="meetingToken"
		:serverUrl="meetingUrl"
		:connect-options="connectOptions"
		:video="userChoices.videoEnabled"
		:audio="userChoices.audioEnabled"
		@disconnected="onLeave"
	>
		<VideoMeeting
			:chatMessageFormatter="formatChatMessageLinks"
		/>
	</Meeting>
</VueMissReact>
</template>