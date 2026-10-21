/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    alias: [
      { find: '@/components/ui/toast', replacement: path.resolve(__dirname, './src/shared/ui/Toast.tsx') },
      { find: '@/shared/ui/toast', replacement: path.resolve(__dirname, './src/shared/ui/Toast.tsx') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
});
