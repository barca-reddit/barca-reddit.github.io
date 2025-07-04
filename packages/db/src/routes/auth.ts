import { sign } from '@tsndr/cloudflare-worker-jwt';
import { Hono } from 'hono';
import { getConnInfo } from 'hono/cloudflare-workers';
import { setCookie } from 'hono/cookie';
import { requestId } from 'hono/request-id';
import { jwtMiddleware } from '../middleware/jwt.js';

const router = new Hono<{ Bindings: Env }>();

router.get('/login', requestId(), async c => {
    const { remote } = getConnInfo(c);

    if (!remote.address) {
        return c.json({ success: false, message: 'Remote address not found' }, 400);
    }

    const { success } = await c.env.LOGIN_RATE_LIMIT.limit({ key: remote.address });

    // this does not seem to work as expected.
    if (!success) {
        return c.json({ success: false, message: 'Rate limit exceeded' }, 429);
    }

    const jwtToken = await sign(
        { exp: Math.floor(Date.now() / 1000) + 7776000 }, // 90 days
        c.env.JWT_SECRET,
        { algorithm: 'HS256' }
    );

    setCookie(c, 'jwt-token', jwtToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7776000, // 90 days
    });

    return c.json({ success: true, message: 'Logged in successfully' });
});

router.get('/test', jwtMiddleware, c => {
    // const payload = c.get('payload');
    return c.json({ success: true, message: 'JWT is valid' });
});


export { router };
