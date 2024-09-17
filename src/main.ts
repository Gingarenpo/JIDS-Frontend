import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {router} from './router'
import Loading from './components/common/Loading.vue'
import Side from './pages/Side.vue'
import { createHead as Meta } from '@unhead/vue'
import { Buffer } from 'buffer'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

globalThis.Buffer = Buffer;

const pinia = createPinia();
pinia.use(createPersistedState());


createApp(App)
.use(router)
.use(Meta)
.component("Loading", Loading)
.component("Side", Side)
.use(pinia)
.mount('#app')
