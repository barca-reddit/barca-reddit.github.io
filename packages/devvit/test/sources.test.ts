// import sourceList from '@repo/db/data/devvit-sources.json' with { type: 'json' };
import { devvitSettings } from '@repo/schemas';
import { beforeAll, describe, expect, test } from 'vitest';

describe('zod schema safeParse', () => {
    let sourceList: unknown;

    beforeAll(async () => {
        const res = await fetch('https://media-reliability.barcareddit.workers.dev/db/devvit-sources');
        sourceList = await res.json();
    });

    test('sources list json', () => {
        const result = devvitSettings
            .shape
            .sources
            .safeParse(sourceList);

        expect(result.error).toBe(undefined);
    });
});