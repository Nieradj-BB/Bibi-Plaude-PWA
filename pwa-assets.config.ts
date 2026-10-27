import { defineConfig, minimal2023Preset as preset } from '@vite-pwa/assets-generator/config'

// Maakt favicon, PWA-iconen en het iPhone-icoon uit public/logo.svg (npm run icons)
export default defineConfig({
  preset,
  images: ['public/logo.svg'],
})
