import {defineConfig, mergeConfig} from 'vite';
import appConfig from './vite.config';

// Keep the shared mobile runtime unchanged; only adapt asset URLs for Pages.
const base = '/xhs-demo/';
export default mergeConfig(appConfig, defineConfig({
  base,
  plugins: [{
    name: 'pages-public-asset-paths',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('/src/') || !/\.(tsx?|json)(?:\?.*)?$/.test(id)) return;
      return {code: code.replace(/(["'`])\/assets\//g, `$1${base}assets/`), map: null};
    },
  }],
}));
