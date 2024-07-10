export default () => ({
  documentation: {
    enabled: true,
    config: {
      "x-strapi-config": {
        plugins: [],
      },
    },
  },
  'custom-field': {
    enabled: true,
    resolve: './src/plugins/custom-field'
  }
});
