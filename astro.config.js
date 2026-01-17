// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://he-designs.cymru",

  i18n: {
    locales: ["en", "cy"],
    defaultLocale: "en",

    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
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