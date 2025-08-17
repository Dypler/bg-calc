import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { resolve } from 'path'

export default defineConfig({
  plugins: [legacy()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        execution: resolve(__dirname, 'execution.html'),
        warranty: resolve(__dirname, 'warranty.html'),
        bid: resolve(__dirname, 'bid.html'),
        advance: resolve(__dirname, 'advance.html'),
        payment: resolve(__dirname, 'payment.html')
      }
    }
  }
})
