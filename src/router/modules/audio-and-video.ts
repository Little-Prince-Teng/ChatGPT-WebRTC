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
					}
				]
			}
		]
	}
]