import { verify } from '@tsndr/cloudflare-worker-jwt';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

type Variables = {
    payload: string;
};

export const jwtMiddleware = createMiddleware<{ Bindings: Env, Variables: Variables }>(async (c, next) => {
    const jwtCookie = getCookie(c, 'jwt-token');

    if (!jwtCookie || typeof jwtCookie !== 'string') {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const valid = await verify(jwtCookie, c.env.JWT_SECRET, { algorithm: 'HS256' });

    if (!valid) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    // Store the payload in the context for later use
    c.set('payload', 'hello');
    await next();
});