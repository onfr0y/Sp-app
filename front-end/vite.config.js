import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcssVite from '@tailwindcss/vite'; // Keep your plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcssVite(), // Call the plugin
    react()
  ],
  // If the above still fails, and you want to use PostCSS:
  // css: {
  //   postcss: {
  //     plugins: [tailwindcss], // Use the directly imported tailwindcss
  //   },
  // },
})