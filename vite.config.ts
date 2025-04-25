
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { componentTagger } from "lovable-tagger";
import path from 'path';

export default defineConfig(({ mode }) => ({
  server: {
<<<<<<< HEAD
    port: 8080
  },
  base: '/dinotradez/', // Add this line - must match your repository name
});
=======
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
>>>>>>> 0b7acf9c2096f457c3733a8199c980336e4528a2
