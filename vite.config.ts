import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import veauryVitePlugins from 'veaury/vite/index.js'
import * as path from 'path'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import RequireTransform from 'vite-plugin-require-transform'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		vue(),
		vueJsx(),
		// type设为vue时, 所有名为react_app目录中的文件的jsx将被react jsx编译，其他文件里的jsx将以vue jsx编译
    // veauryVitePlugins({
    //   type: 'vue'
    // }),
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
				ElementPlusResolver(),
				// 自动导入图标组件
				// 自动导入必须遵循名称格式 {prefix：默认为i}-{collection：图标集合的名称}-{icon：图标名称}
				IconsResolver({
					prefix: 'Icon',
					extension: 'vue',
				}),
			],
			// eslint报错解决方案
			eslintrc: {
				enabled: true, // Default `false`
				filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
				globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
			},
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
				ElementPlusResolver(),
				// 自动注册图标组件
				IconsResolver({
					enabledCollections: ['ep'],
					extension: 'vue',
				}),
			],
		}),
		Icons({
			autoInstall: true,
			compiler: 'vue3',
			defaultStyle: 'font-size: 16px;',
		}),
		// 兼容 require() 引入方式
		RequireTransform({
			fileRegex: /.ts$|.tsx$|.vue$/
		})
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
