// import sourceList from '@repo/db/data/devvit-sources.json' with { type: 'json' };
import { devvitSettings } from '@repo/schemas';
import { beforeAll, describe, expect, test } from 'vitest';

describe('zod schema safeParse', () => {
    let sourceList: unknown;

    beforeAll(async () => {
        const res = await fetch('https://media-reliability.barcareddit.workers.dev/db/sources');
        sourceList = await res.json();
    });

    test('sources list json', () => {
        /**
         * Converting the source list to string is kinda pointless because
         * because the import converts it to an object anyway.
         * 
         * But this is only done for test purposes here so it's fine.
         */
        const result = devvitSettings
            .shape
            .sources
            .safeParse(sourceList);

        expect(result.error).toBe(undefined);
    });
});