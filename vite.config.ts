import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (_error, _req, res) => {
            if (
              'writeHead' in res &&
              !res.headersSent &&
              !res.writableEnded
            ) {
              res.writeHead(502, {
                'Content-Type': 'text/plain',
              })
              res.end('Bad Gateway')
            }
          })
        },
      },
      '/s3': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s3/, ''),
      },
    },
  },
})
