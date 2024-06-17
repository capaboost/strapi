/**
 * user-test controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::user-test.user-test', ({ strapi }) => ({
  saveUserTest: async (ctx, next) => {
    try {
      console.log('i am here');
      
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('No user, cant save a user test.');
      }

      console.log('has user');

      const { type, uid, validTo, data } = ctx.request.body.data;
      console.log('type')

      if (!type || !uid || !validTo || !data) {
        console.log('neco je spatne');
        return ctx.badRequest('All parameters (type, uid, validTo, data) are required');
      }

      console.log('has params');

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
