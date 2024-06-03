import { Middleware } from 'koa';

const rawBodyMiddleware: Middleware = async (ctx, next) => {
  if (ctx.url.startsWith('/api/stripe/webhook')) {
    ctx.req.rawBody = '';
    ctx.req.setEncoding('utf8');
    ctx.req.on('data', (chunk) => {
      ctx.req.rawBody += chunk;
    });
    await new Promise((resolve) => ctx.req.on('end', resolve));
  }
  await next();
};

export default rawBodyMiddleware;
