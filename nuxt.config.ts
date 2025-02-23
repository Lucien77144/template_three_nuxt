export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['@/assets/style/global.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: '@use "~/assets/style/_variables.scss" as *;',
        },
      },
    },
  },

  modules: [
    '@nuxtjs/sanity',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Lato: [500, 700, 800],
          download: true,
          inject: true,
        },
      },
    ],
  ],
  i18n: {
    locales: [
      {
        code: 'en',
        language: 'en-US',
        file: 'en-US.ts',
      },
      {
        code: 'fr',
        language: 'fr-FR',
        file: 'fr-FR.ts',
      },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      cookieSecure: false,
    },
    strategy: 'no_prefix', // don't add language to url
  },

  sanity: {
    projectId: process.env.NUXT_SANITY_PROJECT_ID,
    dataset: process.env.NUXT_SANITY_DATASET,
    useCdn: true, // `false` if you want to ensure fresh data
    // apiVersion: process.env.NUXT_SANITY_API_VERSION || '2021-03-25',
    visualEditing: {
      studioUrl: process.env.NUXT_SANITY_STUDIO_URL || 'http://localhost:3333',
      token: process.env.NUXT_SANITY_API_READ_TOKEN,
      stega: true,
    },
  },

  components: [
    {
      path: '~/components/_UI',
      pathPrefix: false,
      prefix: 'UI',
    },
    '~/components',
  ],

  compatibilityDate: '2024-11-16',
})
