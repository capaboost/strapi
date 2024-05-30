export default {
  routes: [
    {
      method: 'GET',
      path: '/capa-boost',
      handler: 'capa-boost.exampleAction',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
