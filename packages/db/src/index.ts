import { Hono } from 'hono';
// import { router as authRouter } from './routes/auth.js';
import { router as dbRouter } from './routes/db.js';

const app = new Hono<{ Bindings: Env }>();

// app.route('/auth', authRouter);
app.route('/db', dbRouter);

export default {
    fetch: app.fetch,
    // async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    //     console.log(controller);
    // }
};