// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  modules: ["@nuxtjs/tailwindcss"],

  // Configuración de Tailwind CSS
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "~/tailwind.config",
    exposeConfig: false,
    injectPosition: "first",
    viewer: true,
  },

  // Configuración de la app
  app: {
    head: {
      title: "Intercambios",
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
        },
        {
          name: "description",
          content: "A mobile-first dropdown selection app",
        },
        { name: "theme-color", content: "#3b82f6" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ],
      bodyAttrs: {
        class: "overscroll-none",
      },
    },
  },

  // Configuración para Netlify
  nitro: {
    preset: "netlify",
  },

  // Auto-import de composables
  imports: {
    dirs: ["composables/**"],
  },

  // Configuración de desarrollo
  devtools: { enabled: true },

  // Configuración de postcss
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
