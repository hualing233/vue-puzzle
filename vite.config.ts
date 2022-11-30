import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [vue()],
      server: {
        host: '0.0.0.0',
      },
    };
  } else {
    return {
      base: '/vue-puzzle/',
      plugins: [vue()],
    };
  }
});
