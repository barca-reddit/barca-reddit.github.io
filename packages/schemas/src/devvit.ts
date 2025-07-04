import z from 'zod';
import { preprocessStringToArray, preprocessStringToCommaSeparatedArray } from './helpers.js';
import { devvitSourceSchema } from './sources.js';

export const devvitSettings = z.object({
    sources: z.preprocess((data, ctx) => preprocessStringToArray(data, ctx), z.array(devvitSourceSchema)),
    flairTier1Id: z.string(),
    flairTier2Id: z.string(),
    flairTier3Id: z.string(),
    flairTier4Id: z.string(),
    flairTier5Id: z.string(),
    flairCssClass: z.string(),
    commentFooter: z.string(),
    analyzeNamesInBody: z.boolean(),
    analyzeHandlesInBody: z.boolean(),
    analyzeLinksInBody: z.boolean(),
    addTextToFlairs: z.boolean(),
    unreliableSourcesWarning: z.string(),
    ignoredUsers: z.preprocess((data, ctx) => preprocessStringToCommaSeparatedArray(data, ctx), z.array(z.string())),
    errorReportSubredditName: z.string(),
});

export type DevvitSettings = z.infer<typeof devvitSettings>;