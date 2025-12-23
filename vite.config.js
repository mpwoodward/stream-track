import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['logo.svg'],
      manifest: {
        name: 'Stream Track',
        short_name: 'StreamTrack',
        description: 'Track your streaming shows and movies',
        theme_color: '#242424',
        background_color: '#242424',
        display: 'standalone',
        start_url: '/',
        id: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: 'mobile-screenshot.png',
            sizes: '738x773',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Stream Track Mobile'
          },
          {
            src: 'desktop-screenshot.png',
            sizes: '997x698',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Stream Track Desktop'
          }
        ]
      }
    })
  ],
})
