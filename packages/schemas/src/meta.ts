import z from 'zod';

export const dbMetaSchema = z.object({
    lastUpdate: z.string().datetime()
});

export type DBMeta = z.infer<typeof dbMetaSchema>;