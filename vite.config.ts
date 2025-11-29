import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: "./",
  build: {
    target: 'es2015',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    modulePreload: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
})
