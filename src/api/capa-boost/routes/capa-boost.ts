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
    {
      method: 'POST',
      path: '/capa-boost/orders',
      handler: 'capa-boost.orders',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
