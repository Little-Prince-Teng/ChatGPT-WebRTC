import { RouteRecordRaw, Router, createRouter, createWebHistory } from 'vue-router'
import { formatFlatteningRoutes } from './utils'

import Layout from '@/layout/layout.vue'
import { home } from './modules/home'
import { audioAndVideo } from './modules/audio-and-video'

// 用于渲染菜单，面包屑
export const routerList: Array<RouteRecordRaw> = [
	...home,
	...audioAndVideo
]

// 扁平化路由
const flatRouters = formatFlatteningRoutes(routerList)

export const routes: Array<RouteRecordRaw> = [
	// 根目录重定向的页面
	{
		path: '/',
		component: Layout,
		redirect: '/home',
		children: [...flatRouters]
	}
]

const router: Router = createRouter({ history: createWebHistory(), routes })
export default router