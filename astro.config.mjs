import { defineConfig } from 'astro/config';
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

import { loadEnv } from "vite";
const { PUBLIC_BASE_URL, PUBLIC_API_URL } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/': {
      status: 307,
      destination: "/chat"
    },
    '/terms-of-service': {
      status: 301,
      destination: `${PUBLIC_BASE_URL}/terms-of-service`
    },
    '/privacy-policy': {
      status: 301,
      destination: `${PUBLIC_BASE_URL}/privacy-policy`
    },
  },
  markdown: {
    //syntaxHighlight: 'prism',
    //remarkPlugins: [remarkPlugin1],
    gfm: true,
  },
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
      nesting: true
    })
  ],
  vite: {
    define: {
      "process.env.PUBLIC_API_URL": JSON.stringify(PUBLIC_API_URL),
    },
    //ssr: {
    //  noExternal: ["@radix-ui/*"],
    //}
  }
});
