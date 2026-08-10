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

        if (fs.existsSync(clientAssets)) {
          if (!fs.existsSync(rootAssets)) {
            fs.mkdirSync(rootAssets, { recursive: true });
          }
          const files = fs.readdirSync(clientAssets);
          for (const file of files) {
            fs.copyFileSync(path.join(clientAssets, file), path.join(rootAssets, file));
            if (fs.existsSync(vercelAssets)) {
              fs.copyFileSync(path.join(clientAssets, file), path.join(vercelAssets, file));
            }
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
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});


