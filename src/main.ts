import { createApp } from 'vue'
import App from './views/App.vue'
import Router from './router/router.ts'
import { createPinia } from 'pinia'


createApp(App).use(createPinia()).use(Router).mount('#app')
