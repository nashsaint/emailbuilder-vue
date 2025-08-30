// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: 'src/index.js',
            name: 'EmailBuilder',
            formats: ['es'],
            fileName: (format) => `emailbuilder.${format}.js`,
        },
        rollupOptions: {
            external: ['vue'],
            output: { globals: { vue: 'Vue' } },
        },
    },
})
