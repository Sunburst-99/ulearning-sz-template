import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path"; 
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { terser } from "rollup-plugin-terser";
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueSetupExtend(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[name]',
    }),
    Components({
      // directoryAsNamespace: true,  // 是否允许相同文件名
      resolvers: [ElementPlusResolver()],  //自动导入，按需加载
    }),
    // gzip压缩
    viteCompression({
      algorithm: 'gzip', // 使用 gzip 压缩
      ext: '.gz', // 生成的文件扩展名
      threshold: 10240, // 大于10KB的资源才会被压缩
    }),
  ],
  publicDir: resolve(__dirname, 'public'),
  build: {
    minify: 'terser', // 使用 terser 进行压缩
    rollupOptions: {
      plugins: [
        // @ts-ignore
        terser() // 打包压缩
      ],
      // input: getInput(),
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          elementPlus: ['element-plus'],
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
      },
    },
    sourcemap: false,
    emptyOutDir: true, // 打包时清空以前的输出目录
    chunkSizeWarningLimit: 1200,
    // cssCodeSplit: true,  // CSS 将内联到 JS 文件中
  },
  envDir: resolve(__dirname, 'env'),
  // ↓解析配置
  resolve: {
    // ↓路径别名
    alias: {
      "@": resolve(__dirname, "./src"),
      "@images": resolve(__dirname, "./src/assets/images"),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or "modern", "legacy"
        additionalData: `@use "@/styles/mixin.scss" as *;`,
        javascriptEnabled: true,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
})
