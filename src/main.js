import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import './style.css'
import App from './App.vue'
import router from './router'

// Service Worker is REQUIRED for PWA "Install" prompt to appear
const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm('New version available. Reload?')) {
            updateSW(true)
        }
    },
    onOfflineReady() {
        console.log('App is ready to work offline!')
    },
})

const app = createApp(App)
app.use(router)
app.mount('#app')
