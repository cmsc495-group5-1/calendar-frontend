const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    proxy: {
      '/api': {
          target: 'http://localhost:6868/',
          changeOrigin: true,
      },
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
})
