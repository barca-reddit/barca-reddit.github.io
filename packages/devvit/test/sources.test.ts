import sourceList from '@repo/db/data/devvit-sources.json' with { type: 'json' };
import { describe, expect, test } from 'vitest';
import { settingsSchema } from '../src/index.js';

describe('zod schema safeParse', () => {
    test('sources list json', () => {
        /**
         * Converting the source list to string is kinda pointless because
         * because the import converts it to an object anyway.
         * 
         * But this is only done for test purposes here so it's fine.
         */
        const result = settingsSchema
            .shape
            .sources
            .safeParse(JSON.stringify(sourceList));

        expect(result.error).toBe(undefined);
    });
});