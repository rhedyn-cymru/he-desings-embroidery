// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://hedesigns.cymru",

  i18n: {
    locales: ["en", "cy"],
    defaultLocale: "en",

    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date('2026-01-09'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});