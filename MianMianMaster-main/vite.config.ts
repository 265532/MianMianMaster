import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    server: {
      port: 9000,
      // 代理配置
      proxy: env.VITE_PROXY_TARGET
        ? {
            '/api': {
              target: env.VITE_PROXY_TARGET,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          }
        : undefined,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    // 定义全局环境变量
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION),
    },
  }
})
