export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  ssr: false,
  head: {
    title: 'school-frontend',
    htmlAttrs: {
      lang: 'en',
      style: 'background: PowderBlue',
    },
    bodyAttrs: {},

    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['nuxt-buefy', '@nuxtjs/axios', '@nuxtjs/auth'],
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/login',
            method: 'post',
            propertyName: false,
          },
          logout: {
            url: '/logout',
            method: 'post',
          },
          user: {
            url: '/checklogin',
            method: 'get',
            propertyName: false,
          },
        },
        tokenRequired: false,
        tokenType: false,
      },
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.BASE_URL || 'http://localhost:8088',
    credentials: true,
  },
  build: {},
}
