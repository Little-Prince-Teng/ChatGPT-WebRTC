<script setup lang="ts">
import { ElMessage } from 'element-plus'

let localStream: MediaStream
let mediaRecorder: MediaRecorder

let isLocalStreamOpen = ref(false)
const timer = ref(0)

// 在视频标签中播放视频流
function playStream(stream: MediaStream = localStream) {
	const video = document.getElementById('localVideo') as HTMLVideoElement
	video.srcObject = stream
	// 添加 autoplay 属性
	video.onloadedmetadata = () => {
		video.play()
	}
}
// 获取本地音视频流
async function getLocalStream() {
	localStream = await navigator.mediaDevices.getUserMedia({
		audio: true,
		video: true
	})
	// 播放本地视频流
	playStream()
	isLocalStreamOpen.value = true
}
// 关闭本地音视频流
function closeLocalStream() {
	localStream.getTracks().forEach((track) => {
		track.stop()
	})
	isLocalStreamOpen.value = false
}
// 操作本地音视频流
function handleLocalStream() {
	if (isLocalStreamOpen.value) {
		closeLocalStream()
	} else {
		getLocalStream()
	}
}

// 分享屏幕
async function getScreenStream() {
	localStream = await navigator.mediaDevices.getDisplayMedia({
		audio: {
			echoCancellation: true, // 回音消除
      noiseSuppression: true, // 噪音抑制
      autoGainControl: true, // 自动增益
		},
		video: {
			width: 1920, // 视频宽度
      height: 1080, // 视频高度
      frameRate: 60, // 帧率
      aspectRatio: 16 / 9, // 宽高比
		}
	})
	// 播放本地视频流
	playStream()
}

// 开始/停止录制
function startRecord() {
	if (!localStream) {
		ElMessage.warning('请先获取本地音视频流')
		return
	}
	if (mediaRecorder?.state === 'recording') {
		mediaRecorder.stop()
		return
	}
	const options = {
		audioBitsPerSecond: 128000,
    videoBitsPerSecond: 2500000,
		mimeType: 'video/webm;codecs="vp9,opus"'
	}
	const chunks: Blob[] = []
	let timerId: any
	mediaRecorder = new MediaRecorder(localStream, options)
	mediaRecorder.start()

	mediaRecorder.ondataavailable = e => {
		chunks.push(e.data)
	}
	mediaRecorder.onstart = () => {
		// 计时
		timerId = setInterval(() => {
      timer.value++
    }, 1000)
	}
	mediaRecorder.onstop = (e: Event) => {
		timer.value = 0
		clearInterval(timerId)
		const blob = new Blob(chunks, { type: mediaRecorder?.mimeType })
		downloadBlob(blob)
		chunks.length = 0
	}
}
// 下载 Blob
function downloadBlob(blob: Blob) {
	// 将 Blob 对象转换成一个 URL 地址
	const url = URL.createObjectURL(blob)
	// 创建 a 标签
	const a = document.createElement('a')
	// 将 a 标签的 href 设置为 URL
	a.href = url
	// 设置 a 标签的 download 属性为文件名
	a.download = `${new Date().getTime()}.${blob.type.split('/')[1].split(';')[0]}`
	// 模拟点击 a 标签
	a.click()
	// 释放 URL 地址
	URL.revokeObjectURL(url)
}
</script>

<template>
	<div class="webrtc-container">
		<div class="local-video">
			<video id="localVideo" autoplay playsinline muted></video>
		</div>
		<div class="control">
			<div>
				<el-button
					:type="isLocalStreamOpen.value ? 'warning' : 'primary'"
					@click="handleLocalStream"
				>{{ isLocalStreamOpen ? '关闭摄像头' : '打开摄像头' }}</el-button>
				<el-button type="primary" @click="getScreenStream">分享屏幕</el-button>
				<el-button
					:type="timer.value === 0 ? 'success' : 'warning'"
					@click="startRecord"
				>{{ timer === 0 ? ' 开始录制' : '终止录制 | ' + timer }}</el-button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.webrtc-container {
	height: 100%;
	display: flex;
	flex-direction: column;

	.local-video {
		flex: 1;
		display: flex;
		justify-content: center;
    align-items: center;	
	}

	.control {
		position: sticky;
		bottom: 0;
		height: 200px;
		padding: 20px 0;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
		box-sizing: border-box;
		background-color: #516fa3;
	}
}
</style>