<script setup lang="ts">
import  multiavatar from '@multiavatar/multiavatar/esm'

const state = reactive({
  devicesId: '',
  constraints: {
    audio: false,
    video: true,
  } as MediaStreamConstraints,
})

const imgList = ref<string[]>([])

// 获取所有音视频设备
async function getDevices() {
	const devices = await navigator.mediaDevices.enumerateDevices()
}
// 获取本地音视频流
async function getLocalStream(
	options: MediaStreamConstraints = state.constraints
) {
	const stream = await navigator.mediaDevices.getUserMedia(options)
  playLocalStream(stream)
}
// 播放本地视频流
function playLocalStream(stream: MediaStream) {
	const videoEl = document.getElementById('localVideo') as HTMLVideoElement
  videoEl.srcObject = stream
  videoEl.addEventListener('loadedmetadata', () => {})
}

// 创建默认头像
function createAvatar(val: any) {
	const blob = new Blob([multiavatar(val + new Date().getTime())], {
		type: 'image/svg+xml;charset=utf-8',
	})
	const link = URL.createObjectURL(blob)
  return link
}

// 拍照
function takePhoto() {
	const videoEl = document.getElementById('localVideo') as HTMLVideoElement
	const canvas = document.createElement('canvas')
	canvas.width = videoEl.width
	canvas.height = videoEl.height
	const ctx = canvas.getContext('2d')
	ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
	imgList.value.push(canvas.toDataURL('image/png'))
	// 添加滤镜
	const filterList = [
    'blur(5px)', // 模糊
    'brightness(0.5)', // 亮度
    'contrast(200%)', // 对比度
    'grayscale(100%)', // 灰度
    'hue-rotate(90deg)', // 色相旋转
    'invert(100%)', // 反色
    'opacity(90%)', // 透明度
    'saturate(200%)', // 饱和度
    'saturate(20%)', // 饱和度
    'sepia(100%)', // 褐色
    'drop-shadow(4px 4px 8px blue)', // 阴影
  ]
	for (let i = 0; i < filterList.length; i++) {
		ctx.filter = filterList[i]
		ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
		imgList.value.push(canvas.toDataURL('image/png'))
	}
}

onMounted(() => {
	// 初始化获取音视频流
	getLocalStream({
		audio: true,
		video: true,
	})
})
</script>

<template>
	<div class="webrtc-container">
		<div class="photo-list">
			<div
				v-for="item in imgList.length !== 0 ? imgList : 16"
				:key="item"
				class="item-image"
			>
				<img
					:src="imgList.length !== 0 ? item as any : createAvatar(item)"
					alt=""
				/>
			</div>
		</div>
		<div class="control">
			<video id="localVideo" autoplay playsinline muted width="250px" height="200px"></video>
			<el-button class="take-photo-btn" type="primary" @click="takePhoto">拍照</el-button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.webrtc-container {
	margin-top: 2rem;
	display: flex;
	justify-content: space-between;

	.photo-list {
		flex: 1;
		display: grid;
		grid-template-columns: repeat(auto-fit, 150px);
    gap: 20px;

		.item-image {
			width: 150px;
			height: 150px;
			object-fit: contain;
			overflow: hidden;
		}
	}

	.control {
		position: sticky;
		top: 100px;
		right: 20px;
		background-color: #516fa3;
    border: 5px solid #99beff;
    border-radius: 50px;
    min-height: 400px;
    max-height: 500px;
    min-width: 300px;
    max-width: 300px;
    padding: 20px;
    box-sizing: border-box;
    text-align: center;

		.take-photo-btn {
			margin-top: 100px
		}
	}
}
</style>