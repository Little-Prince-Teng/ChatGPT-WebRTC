import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router/index'

import 'element-plus/dist/index.css'

// 公共样式
import '@/styles/index.scss'

const app =createApp(App)

app.use(router).mount('#app')
