import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Adjust if using Vue or another framework

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js', // Explicitly specify PostCSS config (optional)
  },
});