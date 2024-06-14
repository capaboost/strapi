/**
 * A set of functions called "actions" for `capa-boost`
 */

const camelToKebab = (str) => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

export default {
  exampleAction: async (ctx, next) => {
    try {
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  },

  // todo: rename it to placeOrder
  // todo: replace it under user-order entity
  orders: async (ctx: any, next: any) => {
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('You must be logged in to create an order');
      }

      const { order } = ctx.request.body;
      const createdItems: any[] = [];

      for (const item of order) {
        const productTypeKebab = camelToKebab(item.productType);

        const product = await strapi.entityService.findMany(`api::${productTypeKebab}.${productTypeKebab}` as any, {
          filters: { uid: item.productUid },
        });

        if (product.length === 0) {
          return ctx.badRequest(`No product found for type ${item.productType} and uid ${item.productUid}`);
        }

        const newItem = await strapi.entityService.create('api::user-order-item.user-order-item', {
          data: {
            [item.productType]: product[0].id,
          },
        });

        createdItems.push(newItem);
      }


      const createdItemIds = createdItems.map(item => item.id);

      const newOrder = await strapi.entityService.create('api::user-order.user-order', {
        data: {
          status: 'NEW',
          items: createdItemIds,
          user: user.id,
        },
      });

      ctx.body = {
        message: 'Orders processed',
        items: createdItems,
        newOrder,
      };
    } catch (err) {
      console.error('Error processing orders:', err);
      ctx.body = err;
    }
  },

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
};
