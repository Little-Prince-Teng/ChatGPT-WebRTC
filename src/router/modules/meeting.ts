import { RouteRecordRaw } from 'vue-router'

export const meeting: RouteRecordRaw[] = [
	{
		path: '/meeting',
		name: 'meeting',
		component: () => import('@/page/meeting/index.vue'),
		meta: { title: '音视频会议', type: 'single' },
		children: [
			{
				path: '/meeting/rooms/:name',
				name: 'meeting-rooms',
				meta: { title: 'start meeting', fold: true },
				component: () => import('@/page/meeting/rooms/[name].vue')
			}
		]
	}
]