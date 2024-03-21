import { RouteRecordRaw } from 'vue-router'

export const audioAndVideo: RouteRecordRaw[] = [
	{
		path: '/webRTC',
		name: 'webRTC',
		meta: { title: 'WebRTC', type: 'multiple' },
		children: [
			{
				path: '/webRTC/take-photos',
				name: 'webRTC-take-photos',
				meta: { title: '拍照' },
				component: () => import('@/page/webRTC/take-photos.vue')
			},
			{
				path: '/webRTC/record',
				name: 'webRTC-record',
				meta: { title: '分享屏幕，录制' },
				component: () => import('@/page/webRTC/record.vue')
			},
			{
				path: '/webRTC/signaling-p2p',
				name: 'webRTC-signaling-p2p',
				meta: { title: '音视频通话' },
				component: () => import('@/page/webRTC/signaling-p2p.vue')
			}
		]
	}
]