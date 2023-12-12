import { resolve } from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import WindiCSS from "vite-plugin-windicss";

const root = resolve(__dirname, "src");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "public");

const isDev = process.env.__DEV__ === "true";

export default defineConfig({
  plugins: [solidPlugin(), WindiCSS()],
  resolve: {
    alias: {
      "@src": root,
      "@assets": assetsDir,
      "@pages": pagesDir,
    },
  },
  publicDir,
  build: {
    outDir,
    sourcemap: isDev,
    minify: false,
    rollupOptions:{
      input:{
        background: resolve(pagesDir, "background", "index.html"),
        popup: resolve(pagesDir, "popup", "index.html"),
        content: resolve(pagesDir, "content", "index.ts"),
        option: resolve(pagesDir, "options", "index.html"),
      },
      output: {
        entryFileNames: "[name].js",
        // chunkFileNames: "assets/js/[name].js",
        // assetFileNames: (assetInfo) => {
        //   const { dir, name: _name } = path.parse(assetInfo.name as string);
        //   // const assetFolder = getLastElement(dir.split("/"));
        //   // const name = assetFolder + firstUpperCase(_name);
        //   return `assets/[ext]/${_name}.chunk.[ext]`;
        // },
      },
    }
    // lib: {
    //   formats: ['es'],
    //   // name:"content",
    //   entry:[resolve(pagesDir, "content", "index.tsx")],
    //   fileName: (_, entryName) => {
    //     console.log(entryName,_);
    //     return `${entryName}.js`;
    //   },
    // },
    
    // rollupOptions: {
    //   input: {
    //     // devtools: resolve(pagesDir, "devtools", "index.html"),
    //     // panel: resolve(pagesDir, "panel", "index.html"),
    //     // content: resolve(pagesDir, "content", "index.tsx"),
    //     background: resolve(pagesDir, "background", "index.ts"),
    //     // contentStyle: resolve(pagesDir, "content", "style.scss"),
    //     popup: resolve(pagesDir, "popup", "index.html"),
    //     // newtab: resolve(pagesDir, "newtab", "index.html"),
    //     // options: resolve(pagesDir, "options", "index.html"),
    //   },
    //   // output: {
    //   //   entryFileNames: "assets/[name].js",
    //   //   // chunkFileNames: "assets/js/[name].js",
    //   //   assetFileNames: (assetInfo) => {
    //   //     const { dir, name: _name } = path.parse(assetInfo.name as string);
    //   //     // const assetFolder = getLastElement(dir.split("/"));
    //   //     // const name = assetFolder + firstUpperCase(_name);
    //   //     return `assets/[ext]/${_name}.chunk.[ext]`;
    //   //   },
    //   // },
    // },
    
  },
});
