import { z } from 'zod';

export const dbUpdateSchema = z.object({
    type: z.union([
        z.literal('addition'),
        z.literal('removal'),
        z.literal('promotion'),
        z.literal('demotion'),
    ]),
    sourceName: z.string(),
    sourceId: z.string().uuid(),
    updateDate: z.string().datetime(),
    prevTier: z.union([
        z.literal('official'),
        z.literal('1'),
        z.literal('2'),
        z.literal('3'),
        z.literal('4'),
        z.literal('5'),
        z.literal('aggregator'),
    ]).nullable(),
    nextTier: z.union([
        z.literal('official'),
        z.literal('1'),
        z.literal('2'),
        z.literal('3'),
        z.literal('4'),
        z.literal('5'),
        z.literal('aggregator'),
    ]).nullable(),
}).strict();

export type DBUpdate = z.infer<typeof dbUpdateSchema>;
export const dbUpdateListSchema = z.array(dbUpdateSchema);