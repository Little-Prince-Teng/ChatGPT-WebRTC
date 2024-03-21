<script setup lang="ts">
import { ElMessage } from 'element-plus'
import io, { Socket } from 'socket.io-client'
import { onMounted, ref } from 'vue'

const peerConnection = new RTCPeerConnection({
	iceServers: [
		{
			urls: 'stun:stun.voipbuster.com '
		}
	]
})

const userId = Math.random().toString(36).substring(2)
const roomId = ref('')
let socket: Socket
let localStream: MediaStream
let remoteStream: MediaStream
let offerSdp = ''

function initConnect() {
	if (!roomId.value) {
		ElMessage.error('请输入房间号')
		return
	}
	// 本地起一个服务端
	socket = io('http://localhost:3000')

	// 连接成功时触发
	socket.on('connect', () => {
		handleConnect()
	})

	// 断开连接时触发
	socket.on('disconnect', (reason) => {
		if (reason === 'io server disconnect') {
			// 断线是由服务器发起的，重新连接
			socket.connect()
		}
		ElMessage.warning('您已断开连接')
	})

	// 服务器发送报错信息
	socket.on('error', (data) => {
		ElMessage.error(data)
	})

	// 当有用户加入房间时触发
	socket.on('welcome', (data) => {
		ElMessage.success(data.userId === userId ? '成功加入房间' : `${data.userId}加入房间`)
	})

	// 当有用户离开时触发
	socket.on('leave', (data) => {
		ElMessage.warning(data.userId === userId ? '成功离开房间' : `${data.userId}离开房间`)
	})

	// 当有用户发送消息时触发
	socket.on('message', (data) => {
		ElMessage.success(`${data.userId}发送了${data.message}`)
	})

	// 创建offer, 发送给远端
	socket.on('createOffer', (data) => {
		// 发送offer
		if (offerSdp) {
			socket.emit('offer', {
				userId,
				roomId: roomId.value,
				sdp: offerSdp
			})
			return
		}
		createOffer()
	})

	// 收到offer, 创建answer
	socket.on('offer', (data) => {
		createAnswer(data.sdp)
	})

	// 收到answer, 设置远端sdp
	socket.on('answer', (data) => {
		addAnswer(data.sdp)
	})
}

// 连接成功
function handleConnect() {
	socket.emit('join', { userId, roomId: roomId.value })
}

// 创建offer
async function createOffer() {
	// 当一个新的offer ICE候选人被创建时触发事件
	peerConnection.onicecandidate = async (event) => {
		if (event.candidate) {
			offerSdp = JSON.stringify(peerConnection.localDescription)
			// 发送offer
			if (offerSdp) {
				socket.emit('offer', {
					userId,
					roomId: roomId.value,
					sdp: offerSdp
				})
			}
		}
	}
	const offer = await peerConnection.createOffer()
	await peerConnection.setLocalDescription(offer)
}

// 创建answer
async function createAnswer(val: string) {
	const offer = JSON.parse(val)
	peerConnection.onicecandidate = async (event) => {
		// 当一个新的answer ICE candidate被创建时
		if (event.candidate) {
			socket.emit('answer', {
				userId,
				roomId: roomId.value,
				sdp: JSON.stringify(peerConnection.localDescription)
			})
		}
	}
	await peerConnection.setRemoteDescription(offer)
  const answer = await peerConnection.createAnswer()
	// error: DOMException: Failed to execute 'setLocalDescription' on 'RTCPeerConnection': Failed to set local answer sdp: Called in wrong state: stable
  await peerConnection.setLocalDescription(answer)
}

// 添加answer
async function addAnswer(answerSdp: string) {
	const answer = JSON.parse(answerSdp)
	if (!peerConnection.currentRemoteDescription) {
    await peerConnection.setRemoteDescription(answer)
  }
}

// 离开房间
function handleLeave() {
	// 关闭对等连接
	peerConnection.close()
	// 发送离开的消息
	socket.emit('leave', { userId, roomId: roomId.value })
	// 关闭socket连接
	socket.disconnect()
}

// 初始化视频连接
const init = async () => {
	const localVideo = document.getElementById('local-video') as HTMLVideoElement
	const remoteVideo = document.getElementById('remote-video') as HTMLVideoElement
	localStream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: true,
	})
	remoteStream = new MediaStream()
	localVideo.srcObject = localStream
	remoteVideo.srcObject = remoteStream

	localStream.getTracks().forEach((track) => {
		peerConnection.addTrack(track, localStream)
	})

	peerConnection.ontrack = (event) => {
		event.streams[0].getTracks().forEach((track) => {
			remoteStream.addTrack(track)
		})
	}
}

// 打开摄像头
const cameraOpen = ref(true)
// 打开/关闭摄像头
function handleCamera() {
	cameraOpen.value = !cameraOpen.value
	localStream.getVideoTracks().forEach((track) => {
		track.enabled = cameraOpen.value
	})
}

onMounted(async () => {
	await init()
	nextTick(async () => {})
})
</script>

<template>
	<div class="signaling-p2p-container">
		<div class="video-container">
			<div class="main-video">
				<video id="remote-video" class="remote-video" autoplay playsinline></video>
				<div class="video-title">远程视频</div>
			</div>
			<div class="video-list">
				<div class="video-box">
					<video id="local-video" autoplay playsinline></video>
					<div class="video-title">我</div>
				</div>
			</div>
		</div>
		<div class="operation">
			房间号：
			<el-input
				v-model="roomId"
				style="width: 150px; margin-right: 20px;"
				placeholder="要加入的房间号"
				clearable
				@keyup.enter="initConnect"
			></el-input>
			<el-button type="primary" @click="initConnect">加入</el-button>
			<el-button :type="cameraOpen ? 'warning' : 'primary'" @click="handleCamera">{{ cameraOpen ? '关闭' : '打开' }}摄像头</el-button>
			<el-button type="danger" @click="handleLeave">离开</el-button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.signaling-p2p-container {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;

	.video-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	video {
		margin: 0 auto;
		background-color: #363739;
		width: 100%;
		height: 100%;
	}

	.main-video {
		flex: 1;
		height: 100%;
		border-radius: 30px;
		background-color: #111;
		position: relative;
	}

	.video-title {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #111;
		color: #fff;
		text-align: center;
		box-sizing: border-box;
		padding: 5px;
	}

	.video-list {
		width: 300px;
		height: 100%;
		padding: 20px;
		background-color: #111;

		.video-box {
			position: relative;
		}

		video {
			width: 100%;
			height: 200px;
		}
	}

	.operation {
    width: 100%;
    height: 100px;
    text-align: center;
    background-color: #1e1e1e;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>