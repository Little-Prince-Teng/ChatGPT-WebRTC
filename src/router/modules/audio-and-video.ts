import { RouteRecordRaw } from 'vue-router'

export const audioAndVideo: RouteRecordRaw[] = [
	{
		path: '/audio-and-video',
		meta: { title: '音视频', type: 'multiple' },
		children: [
			{
				path: '/audio-and-video/webRTC',
				meta: { title: 'WebRTC', type: 'multiple' },
				children: [
					{
						path: '/audio-and-video/webRTC/take-photos',
						meta: { title: '拍照' },
						component: () => import('@/page/webRTC/take-photos.vue')
					},
					{
						path: '/audio-and-video/webRTC/record',
						meta: { title: '分享屏幕，录制' },
						component: () => import('@/page/webRTC/record.vue')
					},
					{
						path: '/audio-and-video/webRTC/signaling-p2p',
						meta: { title: '音视频通话' },
						component: () => import('@/page/webRTC/signaling-p2p.vue')
					},
					{
						path: '/audio-and-video/webRTC/video-conferencing',
						meta: { title: '视频会议' },
						component: () => import('@/page/webRTC/video-conferencing.vue')
					},	
				]
			}
		]
	}
]