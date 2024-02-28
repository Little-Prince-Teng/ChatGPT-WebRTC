import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import * as path from 'path'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		vue(),
		vueJsx(),
		// api 自动导入
		AutoImport({
			dts: true,
			// 目标文件
			include: [
				/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
				/\.vue$/,
				/\.vue\?vue/, // .vue
			],
			// 全局引入插件
			imports: ['vue', 'vue-router'],
			resolvers: [
				// 自动导入 Element-Plus 的 Api
				ElementPlusResolver()],
		}),
		// 按需导入组件
		Components({
			dts: true, // enabled by default if `typescript` is installed
			include: [
				/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
				/\.vue$/,
				/\.vue\?vue/, // .vue
			],
			resolvers: [
				// 按需导入 Element-Plus 组件
				ElementPlusResolver()
			],
		}),
	],
	// 配置解析器
	resolve: {
		// 设置别名
		alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
		extensions: ['.ts', '.js', 'tsx']
	},
	// 预处理器和Css模块
	css: {
		// css预处理器
		preprocessorOptions: {
			scss: {
				// 给含有中文的scss文件添加@charset:UTF-8
				charset: false,
				// 在全局中使用 index.scss中预定义的变量
				additionalData: '@import "./src/styles/variable.scss";@import "./src/styles/element.scss";',
			}
		}
	}
})
