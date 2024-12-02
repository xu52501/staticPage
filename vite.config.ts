import { defineConfig } from "vite";
import { resolve } from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import alias from "@rollup/plugin-alias";
import legacy from "@vitejs/plugin-legacy";
import injectHTML from "vite-plugin-html-inject";

export default defineConfig(({ mode }) => {
  const getCreateHtmlEntry = (src: string) => {
    return mode === 'development' ? src : resolve(__dirname, `src/pages${src}`);
  }
  /**
   * command - 命令模式
   * mode - 生产、开发模式
   */
  return {
    // 项目根目录，index.html 所在的目录
    // 要配置多页面，所以此处更改项目根目录地址，不再是项目根目录
    // 而是指定的目录下， 以便配置多页面index.html入口
    // root: '.',
    // root: 'src/pages',
    root: mode === 'development' ? 'src/pages' : '',
    // 静态资源服务目录地址
    // 根目录变化，原来的public静态资源目录则需要，指向
    publicDir: resolve(__dirname, "./public"),
    // 存储缓存文件的目录地址
    cacheDir: "",
    //
    resolve: {
      // 设置文件目录别名
      // 根目录地址变更，也需要调整
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    // ...
    // 构建配置项
    build: {
      // target: 'es2015',
      // ...
      // 指定输出目录
      outDir: resolve(__dirname, "dist"),
      // 指定静态资源存放目录
      assetsDir: resolve(__dirname, "src/assets"),
      // 启用、禁用css代码拆分
      cssCodeSplit: true,
      // 构建是否生成source map文件
      // sourcemap: 'inline',
      // rollup 配置打包项
      rollupOptions: {
        // 多页面入口配置
        input: {
          index: resolve("src/pages/index/index.html"),
        },
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            if (
              assetInfo.type === "asset" &&
              /\.(jpe?g|png|gif|svg)$/i.test(assetInfo.name || "")
            ) {
              return "static/image/[name].[hash].[ext]";
            }
            if (
              assetInfo.type === "asset" &&
              /\.(ttf|woff|woff2|eot)$/i.test(assetInfo.name || "")
            ) {
              return "static/fonts/[name].[hash].[ext]";
            }
            return "static/[ext]/[name]-[hash].[ext]";
          },
        },
      },
      // 构建目录自动清除
      emptyOutDir: true,
    },
    plugins: [
      legacy({
        targets: ["defaults", "ie >= 11", "chrome 52"], //需要兼容的目标列表，可以设置多个
        // additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        // renderLegacyChunks: true,
        // polyfills: [
        //   'es.symbol',
        //   'es.array.filter',
        //   'es.promise',
        //   'es.promise.finally',
        //   'es/map',
        //   'es/set',
        //   'es.array.for-each',
        //   'es.object.define-properties',
        //   'es.object.define-property',
        //   'es.object.get-own-property-descriptor',
        //   'es.object.get-own-property-descriptors',
        //   'es.object.keys',
        //   'es.object.to-string',
        //   'web.dom-collections.for-each',
        //   'esnext.global-this',
        //   'esnext.string.match-all'
        // ]
      }),
      // createHtmlPlugin({
      //   minify: true,
      //   pages: [{
      //     entry: resolve('src/pages/about/main.ts'), //根据root的设置，
      //     template: 'src/pages/about.html',
      //     filename: 'about1.html', //名字随意，但必须有
      //     injectOptions: {
      //       data: {
      //         title: 'aboutxxxx',
      //         header: resolve('src/public/head.htm'),
      //       },
      //     },
      //   },
      //   ]
      // }),
      createHtmlPlugin({
        pages: [
          {
            // entry: resolve(__dirname, "src/pages/index/main.ts"), //根据root的设置，
            entry: getCreateHtmlEntry("/index/main.ts"),
            template: "src/pages/index/index.html",
            filename: "index1.html", //名字随意，但必须有
            injectOptions: {
              data: {
                injectScript:
                  '<script src="/static/js/jquery.min.js"></script>',
                header: resolve("src/pages/public/head/head.htm"),
                footer: resolve("src/pages/public/footer/footer.htm"),
              },
            },
          },
        ],
      }),
      // injectHTML({
      //   debug: {
      //     logPath: true,
      //   },
      // }),
    ],
    css: {
      preprocessorOptions: {
        // sass: {
        //   additionalData: `@use "@/assets/style/global.scss" as *;`,
        // },
        scss: {
          additionalData: `@use "@/assets/style/global.scss" as *;`,
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5210
    }
  };
});
