export default {
  routes: [
    {
      method: 'GET',
      path: '/my-orders',
      handler: 'user-order.myOrders',
      config: {
        policies: [],
        middlewares: [],
        description: 'It should get my orders with auth mechanisms'
      },
    },
  ],
};
