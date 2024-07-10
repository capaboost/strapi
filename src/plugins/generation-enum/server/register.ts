import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.customFields.register({
    name: 'generation-enum',
    plugin: 'generation-enum',
    type: 'string',
  });
};