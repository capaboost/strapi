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

      const { type, uid, validTo, data } = ctx.request.body;

      if (!type || !uid || !validTo || !data) {
        return ctx.badRequest('All parameters (type, uid, validTo, data) are required');
      }

      try {
        const newUserTest = await strapi.entityService.create('api::user-test.user-test', {
          data: {
            user: user.id,
            type,
            uid,
            validTo,
            data,
          },
        });

        ctx.send({
          message: 'Record created successfully',
          newUserTest,
        });
      } catch (error) {
        ctx.send({
          message: 'An error occurred',
          error,
        });
      }

      ctx.send({
        msg: 'hello world',
      });
    } catch(err) {
      // todo
    }
  }
}));
