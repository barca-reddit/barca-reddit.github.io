import type { DevvitSource } from '@repo/schemas';
import { devvitSourceSchema } from '@repo/schemas';
import { randomUUID } from 'node:crypto';
import { expect } from 'vitest';

/**
 * Disallow passing normalized values directly to the function.
 */
type CreateSourceParams = {
    [key in keyof Omit<DevvitSource, 'nameNormalized' | 'handlesNormalized' | 'aliasesNormalized'>]+?: DevvitSource[key]
};

export function createSource(params: CreateSourceParams) {
    const source: Omit<DevvitSource, 'nameNormalized' | 'handlesNormalized' | 'aliasesNormalized'> = {
        id: params.id ?? randomUUID(),
        type: params.type ?? 'journalist',
        name: params.name ?? 'name',
        nameIsCommon: params.nameIsCommon ?? false,
        tier: params.tier ?? '1',
        handles: params.handles ?? null,
        domains: params.domains ?? null,
        aliases: params.aliases ?? null,
    };

    return devvitSourceSchema.parse(source);
}

type Entry<T> = ReadonlyArray<readonly [boolean, T]>;
type MatcherFunction<T> = (params: { source: ReturnType<typeof createSource>, content: T }) => boolean;

export function expectEntries<T>(entries: Entry<T>, source: ReturnType<typeof createSource>, matcher: MatcherFunction<T>) {
    return expect(
        entries.map(([_, content]) => matcher({ source, content }))
    ).toEqual(
        entries.map(([expected, _]) => expected)
    );
}