import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import './style.css'
import App from './App.vue'
import router from './router'

// Service Worker is REQUIRED for PWA "Install" prompt to appear
registerSW({ immediate: true })

const app = createApp(App)
app.use(router)
app.mount('#app')
