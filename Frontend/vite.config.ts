import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // includeAssets: ['android/*.png', 'ios/*.png', 'windows11/*.png'],
      manifest: {
        name: 'Swapo',
        short_name: 'Swapo',
        description:
          'Swapo is a skill-by-barter app where you trade your skill(s) for another skill(s).',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'android/android-launchericon-48-48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: 'android/android-launchericon-72-72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: 'android/android-launchericon-96-96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: 'android/android-launchericon-144-144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'android/android-launchericon-192-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'android/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Cache your Django API endpoints
        runtimeCaching: [
          {
            //urlPattern: /^https:\/\/your-api\.com\/api\/.*/i,
            urlPattern: /^https:\/\/swapo-backend\.onrender\.com\/api\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
        globPatterns: [], // Skip file warnings in dev
      },
      devOptions: {
        enabled: true, // Enable PWA in development mode
        type: 'module',
        navigateFallback: 'index.html',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

/* 
Note: To See Full PWA Functionality:
1. Build for production:
    npm run build

2. Preview the production build:
    npm run preview

```
Outputs som' like:
```
    PWA v1.2.0
    mode      generateSW
    precache  25 entries (1.2 MiB)  // ← More files cached
    files generated
      dist/sw.js
      dist/workbox-6fc00345.js
*/
