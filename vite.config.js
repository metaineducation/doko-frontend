import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log("command", command);
  console.log("mode", mode);
  return {
    base: "/", // 基础路径
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        process: "process/browser",
        stream: "stream-browserify",
        zlib: "browserify-zlib",
        util: "util",
      },
    },
    server: {
      proxy: {
        // "/apigw": "//18.136.6.123:9000/",
        // "/apigw": "//www.estatetrader.io",
        "/apigw": "http://13.214.141.214/",
        // "/apigw": "http://172.31.0.37:9000",
      },
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          // 移除console
          drop_console: true,
          // 移除debugger
          drop_debugger: true,
        },
      },
    },
    lintOnSave: process.env.NODE_ENV !== "production",
  };
});
