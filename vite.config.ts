import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { readFileSync, writeFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));
const APP_VERSION = packageJson.version;
const BUILD_TIMESTAMP = new Date().toISOString();

const versionJsonPath = path.resolve(__dirname, 'public/version.json');

const updateVersionJson = () => {
  try {
    const versionJson = {
      version: APP_VERSION,
      buildTimestamp: BUILD_TIMESTAMP,
      appName: 'OFC360',
    };
    writeFileSync(versionJsonPath, JSON.stringify(versionJson, null, 2));
  } catch (error) {
    console.warn('[Vite] Failed to update version.json:', error);
  }
};

updateVersionJson();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'version-injector',
      transform(code, id) {
        if (id.includes('src/app/version.ts')) {
          return code
            .replace('__APP_VERSION__', APP_VERSION)
            .replace('__BUILD_TIMESTAMP__', BUILD_TIMESTAMP);
        }
      },
      buildStart() {
        updateVersionJson();
      },
    },
  ],
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