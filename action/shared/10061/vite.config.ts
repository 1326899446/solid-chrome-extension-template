import { resolve } from 'path';
import { defineConfig } from 'vite';

import packagejson from './package.json';

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.ts'),
      formats: ['es'],
      fileName: packagejson.name,
    },
  },
});
