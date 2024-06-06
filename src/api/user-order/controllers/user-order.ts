/**
 * user-order controller
 */

import { factories } from '@strapi/strapi';
import {  } from '@strapi/utils';

export default factories.createCoreController('api::user-order.user-order', ({ strapi }) => ({
  myOrders: async (ctx, next) => {
    try {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('You must be logged in to view your orders');
      }

      const userOrders = await strapi.entityService.findMany('api::user-order.user-order', {
        filters: { user: user.id },
        populate: {
          items: true,
        },
      });

      ctx.body = {
        message: 'User orders retrieved successfully',
        data: userOrders,
      };
    } catch (err) {
      console.error('Error retrieving user orders:', err);
      ctx.body = err;
    }
  },
}));