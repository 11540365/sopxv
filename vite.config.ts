import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 載入環境變數 (包含 .env 檔案與系統環境變數)
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    // 重要：GitHub Pages 的儲存庫名稱。
    // 如果您的 Repo 網址是 https://github.com/username/my-stock-app
    // 請將這裡改為 '/my-stock-app/'。
    // 如果是部署到 user.github.io (根目錄)，則保持 '/'。
    // 為了通用性，我們讀取 package.json 的 name 或預設 './'
    base: './', 
    
    define: {
      // 這裡是用來欺騙 Google GenAI SDK 的
      // 在 Build time 將 process.env.API_KEY 字串替換為環境變數的值
      'process.env.API_KEY': JSON.stringify(env.GOOGLE_API_KEY || env.VITE_GEMINI_API_KEY)
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    }
  };
});