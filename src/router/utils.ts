import { RouteRecordRaw } from 'vue-router'

/**
 * 将多层嵌套路由处理成一维数组
 * @param routesList 传入路由
 * @returns 返回处理后的一维数组
 */

export function formatFlatteningRoutes(
	routesList: RouteRecordRaw[]
): RouteRecordRaw[] {
	const list = routesList.map((r) => ({ ...r }))
	if (list.length === 0) return list
	const routes = [] as any
	list.forEach(item => {
		if (item.children) {
			routes.push(item)
			routes.push(...formatFlatteningRoutes(item.children))
			item.children = []
		} else {
			routes.push(item)
		}
	})

	return routes
}

/**
 * 通过path获取父级路径
 * @param name 需要获取父级路径的路径
 * @param routes 路由列表
 * @returns 返回处理后的一维路由
 */
export function getParentPaths(
	name: string,
	routes: RouteRecordRaw[]
): RouteRecordRaw[] {
	// 深度遍历查找
	function dfs(
		routes: RouteRecordRaw[],
		path: string,
		parents: RouteRecordRaw[]
	) {
		for (let i = 0; i < routes.length; i++) {
			const item = routes[i]
			// 找到path则返回父级path
			if (item.name === name) return parents
			// children不存在或者为空则不递归
			if (!item.children || !item.children.length) continue
			// 往下查找时将当前path入栈
			parents.push(item)
			if (dfs(item.children, name, parents).length) return parents
			// 深度优先遍历查找，未找到时，将当前path出栈
			parents.pop()
		}
		// 未找到时返回空数组
		return []
	}
	return dfs(routes, name, [])
}