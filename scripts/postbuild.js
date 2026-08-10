import fs from "node:fs";
import path from "node:path";

function patchVercelConfig() {
  try {
    const cwd = process.cwd();
    const vercelConfigPath = path.resolve(cwd, ".vercel/output/config.json");
    if (fs.existsSync(vercelConfigPath)) {
      const rawConfig = fs.readFileSync(vercelConfigPath, "utf-8");
      const config = JSON.parse(rawConfig);
      if (Array.isArray(config.routes)) {
        let modified = false;
        config.routes = config.routes.map((route) => {
          if (route.headers && !route.dest && route.continue !== true) {
            modified = true;
            return { ...route, continue: true };
          }
          return route;
        });
        if (modified) {
          fs.writeFileSync(vercelConfigPath, JSON.stringify(config, null, 2), "utf-8");
          console.log("[postbuild] Patched .vercel/output/config.json with continue: true for asset header routes.");
        }
      }
    }

    const clientAssets = path.resolve(cwd, "dist/client/assets");
    const rootAssets = path.resolve(cwd, "dist/assets");
    const vercelAssets = path.resolve(cwd, ".vercel/output/static/assets");

    fs.mkdirSync(rootAssets, { recursive: true });
    fs.mkdirSync(vercelAssets, { recursive: true });

    if (fs.existsSync(clientAssets)) {
      const files = fs.readdirSync(clientAssets);
      for (const file of files) {
        fs.copyFileSync(path.join(clientAssets, file), path.join(rootAssets, file));
        fs.copyFileSync(path.join(clientAssets, file), path.join(vercelAssets, file));
      }
    }

    const vercelStatic = path.resolve(cwd, ".vercel/output/static");
    const distDir = path.resolve(cwd, "dist");
    if (fs.existsSync(vercelStatic)) {
      fs.cpSync(vercelStatic, distDir, { recursive: true });
    }
  } catch (err) {
    console.error("[postbuild] Error during postbuild execution:", err);
    process.exit(1);
  }
}

patchVercelConfig();
