import z from 'zod';
import { preprocessEmptyStringToUndefined, preprocessStringToArray, preprocessStringToCommaSeparatedArrayOfUsernames, preprocessStringToCommaSeparatedArrayOfUUIDs } from './helpers.js';
import { devvitSourceSchema } from './sources.js';

/**
 * Devvit settings returns empty strings for unset values,
 * which is why all of this preprocessing is required.
 */

export const devvitSettings = z.object({
    sources: z.preprocess((data, ctx) => preprocessStringToArray(data, ctx), z.array(devvitSourceSchema)),
    flairTier1Id: z.preprocess(preprocessEmptyStringToUndefined, z.string().uuid().optional()),
    flairTier2Id: z.preprocess(preprocessEmptyStringToUndefined, z.string().uuid().optional()),
    flairTier3Id: z.preprocess(preprocessEmptyStringToUndefined, z.string().uuid().optional()),
    flairTier4Id: z.preprocess(preprocessEmptyStringToUndefined, z.string().uuid().optional()),
    flairTier5Id: z.preprocess(preprocessEmptyStringToUndefined, z.string().uuid().optional()),
    flairCssClass: z.preprocess(preprocessEmptyStringToUndefined, z.string().nonempty().optional()),
    commentFooter: z.preprocess(preprocessEmptyStringToUndefined, z.string().nonempty().optional()),
    unreliableSourcesWarning: z.preprocess(preprocessEmptyStringToUndefined, z.string().nonempty().optional()),
    analyzeNamesInBody: z.boolean(),
    analyzeHandlesInBody: z.boolean(),
    analyzeLinksInBody: z.boolean(),
    addTextToFlairs: z.boolean(),
    ignoredFlairs: z.preprocess(preprocessStringToCommaSeparatedArrayOfUUIDs, z.array(z.string()).optional()),
    ignoredUsers: z.preprocess(preprocessStringToCommaSeparatedArrayOfUsernames, z.array(z.string()).optional()),
    errorReportSubredditName: z.preprocess(preprocessEmptyStringToUndefined, z.string().min(3).optional()),
});

export type DevvitSettings = z.infer<typeof devvitSettings>;