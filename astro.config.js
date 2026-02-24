// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

const appVersion = process.env.PUBLIC_APP_VERSION || process.env.COMMIT_REF || "000000";

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
    define: {
      "import.meta.env.PUBLIC_APP_VERSION": JSON.stringify(appVersion),
    },
  },
});