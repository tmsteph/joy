import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 8764,
    open: '/examples/toy.html',
    headers: {
      'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
    }
  }
})
