import { createApp } from 'vue'
import App from './views/App.vue'
import Router from './router/router.ts'


createApp(App).use(Router).mount('#app')
