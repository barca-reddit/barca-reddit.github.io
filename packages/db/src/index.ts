import { writeFile } from 'node:fs/promises';
import { devvitSourcesQuery, siteTiersQuery, siteUpdatesQuery } from './db-queries.js';
import { db } from './db.js';

const items = [
    { query: siteUpdatesQuery, file: './data/site-updates.json' },
    { query: devvitSourcesQuery, file: './data/devvit-sources.json' },
    { query: siteTiersQuery, file: './data/site-tiers.json' },
];

await Promise.all(items.map(async ({ query, file }) => {
    if (query === siteUpdatesQuery) {
        const data = (await db.executeQuery(query)).rows;

        /**
         * Apply sorting here becuase kysely doesn't support sorting yet
         * but will do in a future release
         * 
         * @see https://github.com/kysely-org/kysely/pull/896
         */
        const sortedData = data.map(update => ({
            ...update,
            ...update.additions && { additions: update.additions.sort((a, b) => a.name.localeCompare(b.name)) },
            ...update.removals && { removals: update.removals.sort((a, b) => a.name.localeCompare(b.name)) },
            ...update.promotions && { promotions: update.promotions.sort((a, b) => a.name.localeCompare(b.name)) },
            ...update.demotions && { demotions: update.demotions.sort((a, b) => a.name.localeCompare(b.name)) },
        }));

        await writeFile(file, JSON.stringify(sortedData, null, 4));
    }
    else {
        const data = (await db.executeQuery(query)).rows;
        await writeFile(file, JSON.stringify(data, null, 4));
    }
}));

await writeFile('./data/site-meta.json', JSON.stringify({ lastUpdate: new Date() }, null, 4));

await db.destroy();


