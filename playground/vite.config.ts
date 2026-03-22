import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    server: {
      host: '0.0.0.0',
      fs: {
        allow: [resolve(process.cwd(), '..')],
      },
      proxy: {
        '/api': {
          target: process.env.VITE_DEV_SERVER_PROXY_TARGET,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    plugins: [
      vue({
        template: { transformAssetUrls },
      }),

      quasar({
        sassVariables: 'src/styles/quasar.variables.scss',
      }),
    ],
    resolve: {
      alias: {
        '@render-core': resolve(process.cwd(), '../shared/render-core'),
      },
    },
  });
};
