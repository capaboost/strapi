/**
 * user-order controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::user-order.user-order', ({ strapi }) => ({
  async myOrders(ctx) {
    ctx.body = 'Hello World';
  }
}));