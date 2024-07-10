import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.customFields.register({
    name: 'text-field',
    plugin: 'custom-fields',
    type: 'string',
  });
};
