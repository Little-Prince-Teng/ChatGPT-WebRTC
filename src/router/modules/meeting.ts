import { RouteRecordRaw } from 'vue-router'

export const meeting: RouteRecordRaw[] = [
	{
		path: '/meeting',
		component: () => import('@/page/meeting/index.vue'),
		meta: { title: '会议', type: 'single' },
		children: [
			{
				path: '/meeting/rooms/:name',
				meta: { title: 'start meeting' },
				component: () => import('@/page/meeting/rooms/[name].vue')
			}
		]
	}
]