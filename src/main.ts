import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {router} from './router'
import Loading from './components/common/Loading.vue'
import Side from './pages/Side.vue'
import { createHead as Meta } from '@unhead/vue'


createApp(App)
.use(router)
.use(Meta)
.component("Loading", Loading)
.component("Side", Side)
.mount('#app')
