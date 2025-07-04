import { z } from 'zod/v4';

const preprocessStringAsArray = z.transform((value, ctx) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value !== 'string') {
        ctx.issues.push({
            code: 'invalid_type',
            expected: 'string',
            received: typeof value,
            input: value
        });
        return z.NEVER;
    }

    try {
        return JSON.parse(value);
    }

    catch (error) {
        ctx.issues.push({
            code: 'custom',
            message: 'Invalid JSON input',
            input: value
        });
        return z.NEVER;
    }
});

const aliasSchema = z.object({
    alias: z.string(),
    aliasIsCommon: z.boolean(),
});

const handleSchema = z.object({
    handle: z.string(),
    handleIsCommon: z.boolean(),
});

export const sourceSchema = z.object({
    id: z.uuidv4(),
    name: z.string(),
    nameIsCommon: z.coerce.boolean(),
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
    handles: z.pipe(preprocessStringAsArray, z.array(z.string())).nullable(),
    orgs: z.pipe(preprocessStringAsArray, z.array(z.string())).nullable(),
    domains: z.pipe(preprocessStringAsArray, z.array(z.string())).nullable(),
    removed: z.coerce.boolean(),
    // aliases: z.pipe(preprocessStringAsArray, z.array(aliasSchema)).nullable(),
});

export const sourceListSchema = z.array(sourceSchema);

// type Source = z.infer<typeof sourceSchema>;

// const res = sourceSchema.parse({
//     id: '123e4567-e89b-42d3-a456-426614174000',
//     name: 'Example Source',
//     nameIsCommon: true,
//     type: 'official',
//     tier: 'official',
//     handles: JSON.stringify(['@example', '@example2']),
//     orgs: ['Example Org'],
//     domains: JSON.stringify(['example.com']),
//     aliases: [
//         { alias: 'Example Alias', aliasIsCommon: true },
//         { alias: 'Another Alias', aliasIsCommon: false },
//     ],
// });

// console.log(res);