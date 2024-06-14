/**
 * user-order service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::user-order.user-order', ({ strapi }) => ({
  async myOrders(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('You must be logged in to view your orders');
      }

      const userOrders = await strapi.entityService.findMany('api::user-order.user-order', {
        filters: { user: user.id },
        populate: {
          items: {
            populate: {
              testPersonality: true, 
            },
          },
        },
      });

      return userOrders;
    } catch (err) {
      console.error('Error retrieving user orders:', err);
      throw err;
    }
  },
}));
