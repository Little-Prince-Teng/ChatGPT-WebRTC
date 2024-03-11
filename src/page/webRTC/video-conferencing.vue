<script setup lang="ts">
import {
	createLocalTracks,
  DataPacket_Kind,
  LogLevel,
  Room,
  RoomEvent,
  setLogExtension,
  Track,
  VideoPresets
} from 'livekit-client'

import { Microphone } from '@element-plus/icons-vue'
import MediaToggle from '@/components/MediaToggle.vue'

const isLoading = ref(true)

const svg = `
<path class="path" d="
	M 30 15
	L 28 17
	M 25.61 25.61
	A 15 15, 0, 0, 1, 15 30
	A 15 15, 0, 1, 1, 27.99 7.5
	L 15 15
" style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>`

const audioDevices = ref([])
const currentAudioDeviceId = ref()
const videoDevices = ref([])
const currentVideoDeviceId = ref()

const mediaList = reactive([
	{ media: 'MacBookPro', name: 'MacBook Pro麦克风' },
	{ media: 'iPhoneX', name: 'iPhone X的麦克风' }
])

const localVideoList = ref()

function handleTrackSubscribed(track, publication, participant) {
	console.log('track', track)
	
	if (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) {
		// attach it to a new HTMLVideoElement or HTMLAudioElement
		const element = track.attach();
		element.style.width = "200px"
		element.style.height = "200px"
		// 进行视频播放元素的操作
		this.$refs.video_one.append(element);
	}
}

function handleTrackUnsubscribed(track, publication, participant,) {
	// remove tracks from all attached elements
	console.log(track);
	console.log(publication);
	console.log(participant);
	track.detach();
}

function handleLocalTrackUnpublished(track, participant) {
	console.log(track);
	console.log(participant);
	// when local tracks are ended, update UI to remove them from rendering
	track.detach();
}

function handleActiveSpeakerChange(speakers) {
	console.log(speakers);
	// show UI indicators when participant is speaking
}

function handleDisconnect() {
	console.log('disconnected from room');
}

function TrackEventCallbacks(audioPlaybackFailed) {
	console.log(audioPlaybackFailed)
}

function TrackPublished(track, publication, participant) {
	console.log(track)
	console.log(publication)
	console.log(participant)
}

function DataReceived(payload, participant, kind) {
	const decoder = new TextDecoder()
	const strData = decoder.decode(payload)
	console.log(strData)
	console.log(participant)
	console.log(kind)
}

onMounted(async () => {
	try {
		isLoading.value = true
		const livekit = require('livekit-client')
		const room = new livekit.Room({
			// automatically manage quality of subscribed video tracks to optimize for bandwidth and CPU
			adaptiveStream: true,
			// optimize publishing bandwidth and CPU for published tracks
			dynacast: true,
			// videoCaptureDefaults: {
			// 	resolution: VideoPresets.h720.resolution
			// }
		})
		const strData = JSON.stringify({ some: "data" })
    const encoder = new TextEncoder()
		// publishData takes in a Uint8Array, so we need to convert it
    const data = encoder.encode(strData)
		// publish to everyone in the room
		room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE)
		// publish to specific participants
    room.localParticipant.publishData(data, DataPacket_Kind.LOSSY, ['participant_sid'])
		// 设置房间的参数
		room
			// 轨道订阅
			.on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
			// 取消订阅
			.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
			// 活动扬声器已更改
			.on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakerChange)
			// 断开的
			.on(RoomEvent.Disconnected, handleDisconnect)
			// 音频播放状态已更改
			.on(RoomEvent.AudioPlaybackStatusChanged, () => {
				console.log("Audio playback status changed to", room.canPlaybackAudio)
			})
			// 跟踪静音
			.on(RoomEvent.TrackUnmuted, (res) => {
				console.log("Track muted", res)
			})
			//轨迹静音
			.on(RoomEvent.TrackMuted, (res) => {
				console.log("TrackMuted muted", res)
			})
			// 房间元数据已更改
			.on(RoomEvent.RoomMetadataChanged,(res)=>{
				console.log("RoomMetadataChanged muted", res)
			})
			// 跟踪流状态已更改
			.on(RoomEvent.TrackStreamStateChanged,(res)=>{
				console.log("RoomMetadataChanged muted", res)
			})
			// 轨道出版
			.on(RoomEvent.TrackPublished, TrackPublished)
			// 收到的数据
			.on(RoomEvent.DataReceived, DataReceived)
			// 本地曲目未发布
			.on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished)

		const url = 'wss://webrtc-video-conferencing-umt4ef6f.livekit.cloud'
		const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTA1Nzc0NTgsImlzcyI6IkFQSUxnQnE5amVMYjdpRyIsIm5iZiI6MTcwOTk3NzQ1OCwic3ViIjoibHUtdGVuZyIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJsdC1yb29tIiwicm9vbUpvaW4iOnRydWV9fQ.xc0iEuEICCwoT1DDokWkGmO0v6xqLvFMTt-RQmYoKJY"
		// connect to room
		await room.connect(url, token)
		// 房间的状态
		await room.localParticipant.enableCameraAndMicrophone()
		// await p.setScreenShareEnabled(true)

		// 在创建房间之前创建轨道
		const localTrack = await createLocalTracks({
			audio: true,
			video: true,
		})

		// 获取所有音频设备
		audioDevices.value = await Room.getLocalDevices('audioinput')
		// 获取最后一个音频设备并作为默认音频
		const audioDevice = audioDevices.value[audioDevices.value.length - 1]
		currentAudioDeviceId.value = audioDevice.deviceId
		// 在当前房间中，切换到默认音频输入
		await room.switchActiveDevice('audioinput', currentAudioDeviceId.value)

		// 获取所有视频设备
		videoDevices.value = await Room.getLocalDevices('videoinput')
		// 获取最后一个视频设备并作为默认视频
		const videoDevice = videoDevices.value[videoDevices.value.length - 1]
		currentVideoDeviceId.value = videoDevice.deviceId
		// 在当前房间中，切换到默认视频输入
		await room.switchActiveDevice('videoinput', currentVideoDeviceId.value)

		isLoading.value = false

		const p = room.localParticipant
		if (p.isCameraEnabled) {
			const publication = await p.getTrackPublication(Track.Source.Camera)
			if (publication?.isSubscribed) {
				const videoElement = await publication.videoTrack?.attach()
				localVideoList.value.append(videoElement)
			}
		}
		// 设置日志
		setLogExtension((level, msg, context) => {
			const enhancedContext = {...context, timeStamp: Date.now()}
			if (level >= LogLevel.debug) {
				console.log(level, msg, enhancedContext)
			}
		})

	} catch(e) {
		console.log(e)
		// loading.value = false
	}
})
</script>

<template>
	<div class="room-container">
		<div v-if="isLoading" class="loading">
			<div>{{ isLoading }}</div>
			<div
				v-loading="isLoading"
				element-loading-text="Connecting..."
				:element-loading-spinner="svg"
				element-loading-svg-view-box="-10, -10, 50, 50"
				element-loading-background="rgba(122, 122, 122, 0.8)"
			></div>
		</div>
		<div v-else class="video-conference">
			<div class="video-conference-innner">
				<div class="focus-layout-wrapper">
					<div class="focus-layout">
						<div class="aside"></div>
						<div class="participant-tile">
							<div ref="localVideoList" class="me_style"></div>
							<div ref="remoteVideoList" class="user_style"></div>
						</div>
						<div class="participant-metadata"></div>
					</div>
				</div>
				<div class="control-bar">
					<MediaToggle
						media-default-text="Microphone"
						:media-icon="Microphone"
						:media-list="audioDevices"
						:current-media-id="currentAudioDeviceId?.value"
					></MediaToggle>
					<el-button type="primary">共享屏幕</el-button>
				</div>
			</div>
		</div>
  </div>
</template>

<style lang="scss" scoped>
.room-container {
	position: relative;
	width: 100%;
	height: 100%;
	background-color: #111;

	.loading {
		height: 100%;
	}

	.video-conference {
		position: relative;
		display: flex;
		height: 100%;

		.control-bar {
			padding: 0.75rem;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}
</style>