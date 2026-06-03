import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { mockSsePlugin } from './src/mock/plugins/mock-sse-plugin'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      ...(env.VITE_USE_MOCK === 'true' ? [mockSsePlugin()] : []),
    ],
    server: {
      port: 5173,
      proxy: env.VITE_PROXY_TARGET
        ? {
            '/api': {
              target: env.VITE_PROXY_TARGET,
              changeOrigin: true,
              timeout: 60000,
            },
          }
        : undefined,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router', 'pinia'],
            'vendor-echarts': ['echarts'],
            'vendor-lucide': ['lucide-vue-next'],
            'vendor-axios': ['axios'],
            'vendor-chart': ['chart.js'],
          }
        }
      },
      chunkSizeWarningLimit: 600,
    }
  }
})
