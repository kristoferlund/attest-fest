import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import rollupNodePolyFill from "rollup-plugin-polyfill-node";

// // https://vitejs.dev/config/
// export default defineConfig({
//   ...(process.env.NODE_ENV === "development"
//     ? {
//         define: {
//           global: "window",
//           process: {
//             env: {
//               TEST_NETWORK: "",
//             },
//           },
//         },
//       }
//     : {}),
//   plugins: [react()],
// });

export default defineConfig({
  plugins: [react()],
  base: "",
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
});
