export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: '~/tailwind.config',
    injectPosition: 0,
    viewer: false,
  },
  app: {
    head: {
      title: 'Dropdown Selector App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'A mobile-first dropdown selection app' },
        { name: 'theme-color', content: '#3b82f6' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ],
      bodyAttrs: {
        class: 'overscroll-none'
      }
    }
  },
  // Configuración para servir archivos estáticos
  nitro: {
    preset: 'netlify'
  },
  // Habilita el auto-import de composables
  imports: {
    dirs: ['composables/**']
  }
})