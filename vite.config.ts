// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: "generateSW",
      registerType: "autoUpdate",
      manifest: false,
      devOptions: { enabled: true },
      includeAssets: ["icons/icon-192.png", "icons/icon-512.png"],

      workbox: {
        navigateFallback: "/index.html",
        clientsClaim: true,
        skipWaiting: true,

        additionalManifestEntries: [
          { url: "/manifest.webmanifest", revision: null },
        ],

        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "worker",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "app-shell" },
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "images" },
          },
        ],
      },
    }),
  ],
});
