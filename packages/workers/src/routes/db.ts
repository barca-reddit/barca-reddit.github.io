import { dbMetaSchema, dbSourceListSchema, dbUpdateListSchema } from '@repo/schemas';
import camelCaseKeys from 'camelcase-keys';
import { Hono } from 'hono';

const router = new Hono<{ Bindings: Env }>();

router.get('/sources', async (c) => {
    const res = await c.env.DB.prepare('SELECT * FROM sources_list;').all();

    const data = dbSourceListSchema.safeParse(
        camelCaseKeys(res.results, { deep: true }),
    );

    if (!data.success) {
        console.error(JSON.stringify(data.error.format(), null, 2));
        return c.json({ success: false });
    }

    return c.json(data.data);
});

router.get('/updates', async (c) => {
    const res = await c.env.DB.prepare('SELECT * FROM updates_list;').all();

    const data = dbUpdateListSchema.safeParse(
        camelCaseKeys(res.results, { deep: true }),
    );

    if (!data.success) {
        console.error(JSON.stringify(data.error.format(), null, 2));
        return c.json({ success: false });
    }

    return c.json(data.data);
});

router.get('/meta', async (c) => {
    const res = await c.env.DB.prepare('SELECT * FROM meta_latest;').first();

    if (!res) {
        return c.json({ success: false, error: 'No meta data found' });
    }

    const data = dbMetaSchema.safeParse(
        camelCaseKeys(res, { deep: true })
    );

    if (!data.success) {
        console.error(JSON.stringify(data.error.format(), null, 2));
        return c.json({ success: false });
    }

    return c.json(data.data);
});

export { router };
