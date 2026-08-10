import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "node:fs";
import path from "node:path";

function copyAssetsPlugin() {
  return {
    name: "copy-assets-plugin",
    closeBundle() {
      try {
        const clientAssets = path.resolve(process.cwd(), "dist/client/assets");
        const rootAssets = path.resolve(process.cwd(), "dist/assets");
        const vercelAssets = path.resolve(process.cwd(), ".vercel/output/static/assets");

        fs.mkdirSync(rootAssets, { recursive: true });
        fs.mkdirSync(vercelAssets, { recursive: true });

        if (fs.existsSync(clientAssets)) {
          const files = fs.readdirSync(clientAssets);
          for (const file of files) {
            fs.copyFileSync(path.join(clientAssets, file), path.join(rootAssets, file));
            fs.copyFileSync(path.join(clientAssets, file), path.join(vercelAssets, file));
          }
        }
      } catch (err) {
        console.warn("[copyAssetsPlugin] Warning syncing assets:", err);
      }
    },
  };
}

export default defineConfig({
  vite: {
    base: "/",
    build: {
      assetsDir: "assets",
    },
    plugins: [copyAssetsPlugin()],
  },
  nitro: { preset: "vercel" },
  tanstackStart: {
    server: { entry: "server" },
  },
});
