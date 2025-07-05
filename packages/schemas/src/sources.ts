import { z } from 'zod';
import { normalizeText, preprocessStringToArray } from './helpers.js';

const aliasSchema = z.object({
    alias: z.string(),
    aliasIsCommon: z.coerce.boolean(),
});

const handleSchema = z.object({
    handle: z.string(),
    platform: z.union([
        z.literal('x'),
        z.literal('bsky'),
    ])
});

const baseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    nameIsCommon: z.coerce.boolean().default(false),
    type: z.union([
        z.literal('official'),
        z.literal('journalist'),
        z.literal('media'),
        z.literal('aggregator'),
    ]),
    tier: z.union([
        z.literal('official'),
        z.literal('1'),
        z.literal('2'),
        z.literal('3'),
        z.literal('4'),
        z.literal('5'),
        z.literal('aggregator'),
    ]),
    orgs: z.preprocess(preprocessStringToArray, z.array(z.string())).nullable(),
    handles: z.preprocess(preprocessStringToArray, z.array(handleSchema)).nullable(),
    domains: z.preprocess(preprocessStringToArray, z.array(z.string())).nullable(),
    aliases: z.preprocess(preprocessStringToArray, z.array(aliasSchema)).nullable(),
    addedOn: z.coerce.date(),
    updatedOn: z.coerce.date().nullable(),
    removed: z.coerce.boolean(),
});

const dbSourceSchema = baseSchema.strict();
const devvitBaseSchema = baseSchema.omit({
    addedOn: true,
    updatedOn: true,
    removed: true,
    orgs: true,
}).strict();

export const devvitSourceSchema = baseSchema.omit({
    addedOn: true,
    updatedOn: true,
    removed: true,
    orgs: true,
}).transform(data => ({
    ...data,
    nameNormalized: normalizeText(data.name),
    handlesNormalized: data.handles
        ? data.handles.map(handle => ({
            ...handle,
            handleNormalized: normalizeText(handle.handle),
        }))
        : null,
    aliasesNormalized: data.aliases
        ? data.aliases.map(alias => ({
            ...alias,
            aliasNormalized: normalizeText(alias.alias)
        }))
        : null,
}));

export type DBSource = z.infer<typeof dbSourceSchema>;
export const dbSourceListSchema = z.array(dbSourceSchema);

export type DevvitSource = z.infer<typeof devvitSourceSchema>;
export const devvitSourceListSchema = z.array(devvitSourceSchema);

export type DevvitBase = z.infer<typeof devvitBaseSchema>;
export const devvitBaseListSchema = z.array(devvitBaseSchema);