import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  server: {
    host: "0.0.0.0",
  },

  envPrefix: ["PUBLIC_"],

  // 開発環境の場合、Dataディレクトリをenvで指定した場所にする
  resolve: {
    alias: {
      "@": "/src",

      "@@": process.env.DATA_DIR ?? "public",
    }
  }
})
