export default () => ({
  documentation: {
    enabled: true,
    config: {
      "x-strapi-config": {
        plugins: [],
      },
    },
  },
  'generation-enum': {
    enabled: true,
    resolve: './src/plugins/generation-enum'
  },
});
