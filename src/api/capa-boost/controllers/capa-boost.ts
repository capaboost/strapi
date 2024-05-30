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

  orders: async (ctx, next) => {
    try {
      // Přečtení dat z požadavku
      const { order } = ctx.request.body;

      // Pole pro uložení vytvořených záznamů
      const createdItems = [];

      // Iterace přes všechny objednávky
      for (const item of order) {
        // Převedení productType z camel case na kebab case
        const productTypeKebab = camelToKebab(item.productType);

        // Vyhledání záznamu v tabulce podle productType a productUid
        const product = await strapi.entityService.findMany(`api::${productTypeKebab}.${productTypeKebab}` as any, {
          filters: { uid: item.productUid }
        });

        if (product.length === 0) {
          return ctx.badRequest(`No product found for type ${item.productType} and uid ${item.productUid}`);
        }

        // Vytvoření záznamu v entitě user-order-item
        const newItem = await strapi.entityService.create('api::user-order-item.user-order-item', {
          data: {
            [item.productType]: product[0].id
          },
        });

        // Přidání vytvořeného záznamu do pole
        createdItems.push(newItem);
      }

      // Extrakce ID vytvořených záznamů
      const createdItemIds = createdItems.map(item => item.id);

      // Vytvoření user-order s přidáním user-order-items
      const newOrder = await strapi.entityService.create('api::user-order.user-order', {
        data: {
          status: 'NEW',
          items: createdItemIds,  // Přiřazení vytvořených položek podle jejich ID
        },
      });

      // Vrácení vytvořených záznamů v odpovědi
      ctx.body = {
        message: 'Orders processed',
        items: createdItems,
        newOrder,
      };
    } catch (err) {
      ctx.body = err;
    }
  },
};
