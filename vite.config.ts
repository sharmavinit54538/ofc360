import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@/components/ui/toast', replacement: path.resolve(__dirname, './src/shared/ui/Toast.tsx') },
      { find: '@/shared/ui/toast', replacement: path.resolve(__dirname, './src/shared/ui/Toast.tsx') },
      { find: '@/components/ui/Tabs', replacement: path.resolve(__dirname, './src/shared/ui/Tabs.tsx') },
      { find: '@/components/ui/tabs', replacement: path.resolve(__dirname, './src/shared/ui/Tabs.tsx') },
      { find: '@/shared/ui/tabs', replacement: path.resolve(__dirname, './src/shared/ui/Tabs.tsx') },
      { find: '@/shared/ui/Tabs', replacement: path.resolve(__dirname, './src/shared/ui/Tabs.tsx') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
  server: {
    port: 8080,
    strictPort: true,
    host: true,
    open: false,
  },
});
