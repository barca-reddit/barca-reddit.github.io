import { readFile, writeFile } from 'node:fs/promises';
import { devvitSourcesQuery, siteTiersQuery, siteUpdatesQuery } from './db-queries.js';
import { db } from './db.js';

async function tryReadJson(path: string) {
    try {
        return JSON.parse(await readFile(path, 'utf-8')) as object;
    }
    catch (error: unknown) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            return null;
        }
        throw error;
    }
}

const queries = {
    siteTiers: {
        data: (await db.executeQuery(siteTiersQuery)).rows,
        path: './data/site-tiers.json',
        compareHash: false,
        isUpdated: true,
    },
    siteUpdates: {
        /**
         * Apply sorting here becuase kysely doesn't support sorting yet
         * but will do in a future release
         * 
         * @see https://github.com/kysely-org/kysely/pull/896
         */
        data: (await db.executeQuery(siteUpdatesQuery)).rows.map(update => ({
            ...update,
            ...update.additions && { additions: update.additions.sort((a, b) => a.name.localeCompare(b.name)) },
            ...update.removals && { removals: update.removals.sort((a, b) => a.name.localeCompare(b.name)) },
            ...update.promotions && { promotions: update.promotions.sort((a, b) => a.name.localeCompare(b.name)) },
            ...update.demotions && { demotions: update.demotions.sort((a, b) => a.name.localeCompare(b.name)) },
        })),
        path: './data/site-updates.json',
        compareHash: true,
        isUpdated: true,
    },
    devvitSources: {
        data: (await db.executeQuery(devvitSourcesQuery)).rows,
        path: './data/devvit-sources.json',
        compareHash: false,
        isUpdated: true,
    },
};

await Promise.all(Object.entries(queries).map(async ([_, item]) => {
    const file = await tryReadJson(item.path);

    if (file && item.compareHash) {
        item.isUpdated = JSON.stringify(file) !== JSON.stringify(item.data);
        console.log(item);
    }

    await writeFile(item.path, JSON.stringify(item.data, null, 4));
}));

/**
 * Only update the site-meta.json file if site-updates
 * have been updated or if it didn't exist before
 */
if (queries.siteUpdates.isUpdated) {
    await writeFile('./data/site-meta.json', JSON.stringify({ lastUpdate: new Date() }, null, 4));
}

await db.destroy();