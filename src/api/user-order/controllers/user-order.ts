/**
 * user-order controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::user-order.user-order', ({ strapi }) => ({
  myOrders: async (ctx, next) => {
    try {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('You must be logged in to view your orders');
      }

      const userOrders = await strapi.service('api::user-order.user-order').myOrders(ctx);

      ctx.body = userOrders;
    } catch (err) {
      console.error('Error retrieving user orders:', err);
      ctx.body = err;
    }
  },
}));