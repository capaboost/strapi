/**
 * user-test controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::user-test.user-test', ({ strapi }) => ({
  saveUserTest: async (ctx, next) => {
    try {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('No user, cant save a user test.');
      }

      const { type, testUid, validTo, data, orderId } = ctx.request.body.data;

      if (!type || !testUid || !validTo || !data || !orderId) {
        return ctx.badRequest('All parameters (type, testUid, validTo, data, orderId) are required');
      }

      try {
        const newUserTest = await strapi.entityService.create('api::user-test.user-test', {
          data: {
            user: user.id,
            type,
            testUid,
            validTo,
            data,
          },
        });

        const userOrders = await strapi.service('api::user-order.user-order').myOrders(ctx);
        const userOrder = userOrders.find(order => order.id === orderId);
        if (!userOrder) {
          return ctx.forbidden('Order not found or does not belong to the user');
        }
        await strapi.entityService.update('api::user-order.user-order', orderId, {
          data: {
            status: 'COMPLETED',
          },
        });

        ctx.send({
          newUserTest,
        });
      } catch (error) {
        ctx.send({
          message: 'An error occurred',
          error,
        });
      }
    } catch(err) {
      // todo
    }
  }
}));
