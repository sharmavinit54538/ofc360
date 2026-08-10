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

        const vercelStatic = path.resolve(process.cwd(), ".vercel/output/static");
        const distDir = path.resolve(process.cwd(), "dist");
        if (fs.existsSync(vercelStatic)) {
          fs.cpSync(vercelStatic, distDir, { recursive: true });
        }

        // Patch .vercel/output/config.json to ensure header-only asset routes specify `continue: true`
        const vercelConfigPath = path.resolve(process.cwd(), ".vercel/output/config.json");
        if (fs.existsSync(vercelConfigPath)) {
          const rawConfig = fs.readFileSync(vercelConfigPath, "utf-8");
          const config = JSON.parse(rawConfig);
          if (Array.isArray(config.routes)) {
            let modified = false;
            config.routes = config.routes.map((route: Record<string, unknown>) => {
              if (route.headers && !route.dest && route.continue !== true) {
                modified = true;
                return { ...route, continue: true };
              }
              return route;
            });
            if (modified) {
              fs.writeFileSync(vercelConfigPath, JSON.stringify(config, null, 2), "utf-8");
              console.log("[copyAssetsPlugin] Successfully patched .vercel/output/config.json with continue: true for header routes.");
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
    server: { entry: "server" },
  },
});
