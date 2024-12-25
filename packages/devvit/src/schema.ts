import type { RefinementCtx } from 'zod';
import { z } from 'zod';
import { normalizeText } from './index.js';

function preprocessCommaSeparated(value: unknown, ctx: RefinementCtx) {
    if (typeof value !== 'string') {
        ctx.addIssue({
            code: 'invalid_type',
            expected: 'string',
            received: typeof value,
        });

        return z.NEVER;
    }

    try {
        const usernames = value.split(',').map(item => item.trim());

        // reddit usernames can only contain alphanumeric characters, underscores and hyphens
        if (usernames.some(username => /[^a-zA-Z0-9_-]/.test(username))) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid input. Reddit usernames can only contain alphanumeric characters, underscores and hyphens.',
                fatal: true,
            });

            return z.NEVER;
        }

        return usernames;
    }

    catch (error) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid input. Expected comma-separated string with values.',
            fatal: true,
        });

        return z.NEVER;
    }
}

/**
 * @see https://zod.dev/ERROR_HANDLING
 */
function preprocessJSON(value: unknown, ctx: RefinementCtx) {
    if (typeof value !== 'string') {
        ctx.addIssue({
            code: 'invalid_type',
            expected: 'string',
            received: typeof value,
        });

        return z.NEVER;
    }

    try {
        return JSON.parse(value);
    }

    catch (error) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid JSON input',
            fatal: true,
        });

        return z.NEVER;
    }
}

const aliasSchema = z.object({
    alias: z.string(),
    aliasIsCommon: z.boolean(),
});

export const sourceSchema = z.object({
    id: z.string(),
    name: z.string(),
    nameIsCommon: z.boolean(),
    tier: z.union([
        z.literal('official'),
        z.literal('1'),
        z.literal('2'),
        z.literal('3'),
        z.literal('4'),
        z.literal('5'),
        z.literal('aggregator'),
    ]),
    handles: z.array(z.string()).nullable(),
    domains: z.array(z.string()).nullable(),
    aliases: z.array(aliasSchema).nullable(),
}).transform(data => ({
    ...data,
    nameNormalized: normalizeText(data.name),
    handlesNormalized: data.handles ? data.handles.map(handle => normalizeText(handle)) : null,
    aliasesNormalized: data.aliases ? data.aliases.map(alias => ({ ...alias, aliasNormalized: normalizeText(alias.alias) })) : null,
}));

export const settingsSchema = z.object({
    sources: z.preprocess((data, ctx) => preprocessJSON(data, ctx), z.array(sourceSchema)),
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
    ignoredUsers: z.preprocess((data, ctx) => preprocessCommaSeparated(data, ctx), z.array(z.string())),
    errorReportSubredditName: z.string(),
});

