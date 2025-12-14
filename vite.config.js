import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  server: {
    proxy: {
      '/relative': {
        target: 'http://127.0.0.1:4523/m1/7239949-6966552-default',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})
