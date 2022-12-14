import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // 设置打包路径
  server: {
    host: true,
    port: 4000, // 设置服务启动端口号
    open: true, // 设置服务启动时是否自动打开浏览器
    cors: true, // 允许跨域
    proxy: {
      '/api': {
        target: 'http://localhost:9002',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '#': resolve(__dirname, 'types'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // mixin和variable里面是函数和变量等供scss使用的非实体css, scss-loader需要
        additionalData: `
          @import "@/assets/scss/mixin.scss";
          @import "@/assets/scss/variable.scss";
        `,
      },
    },
  },
  plugins: [
    vue(),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    }),
    eslintPlugin({
      include: [
        'src/**/*.js',
        'src/**/*.vue',
        'src/*.js',
        'src/*.vue',
        'src/**/*.ts',
        'src/**/*.tsx',
      ],
    }),
  ],
})
