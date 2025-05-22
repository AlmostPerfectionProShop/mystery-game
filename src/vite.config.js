// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import the 'path' module for resolving absolute paths

export default defineConfig({
  // Add the React plugin for Vite
  plugins: [react()],
  // Configure how modules are resolved
  resolve: {
    // Define aliases for import paths
    alias: {
      // The '@' alias will now resolve to the 'src' directory
      // This is crucial for imports like "@/components/ui/button"
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Optimize the build process with Rollup options
  build: {
    rollupOptions: {
      // You can add external modules here if needed, but for UI components,
      // they usually need to be bundled with the application.
      // The original error suggested externalizing, but that's typically
      // for libraries that should NOT be bundled (e.g., React itself if using a CDN).
      // For your components, they should be bundled.
    },
  },
});

