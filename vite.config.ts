import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'es2020',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    lib: {
      entry: {
        index: r('src/index.ts'),
        'extensions/image-upload/index': r('src/extensions/image-upload/index.ts'),
        'extensions/lightbox/index': r('src/extensions/lightbox/index.ts'),
        'extensions/image-lightbox/index': r('src/extensions/image-lightbox/index.ts'),
        'extensions/grid/index': r('src/extensions/grid/index.ts'),
        'extensions/flex-columns/index': r('src/extensions/flex-columns/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      // externalize 所有第三方（@tiptap/*、vue、@floating-ui 等），只打包自家原始碼
      external: (id) => !id.startsWith('.') && !id.startsWith('/') && !/^[A-Za-z]:[\\/]/.test(id),
      output: {
        preserveModules: false,
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
  },
})
