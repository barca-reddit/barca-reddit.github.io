import { expect } from 'vitest';
import { sourceSchema } from '../src/index.js';
import type { Source } from '../src/types.js';

/**
 * Disallow passing normalized values directly to the function.
 */
type CreateSourceParams = {
    [key in keyof Omit<Source, 'nameNormalized' | 'handlesNormalized' | 'aliasesNormalized'>]+?: Source[key]
};

export function createSource(params: CreateSourceParams) {
    const source: Omit<Source, 'nameNormalized' | 'handlesNormalized' | 'aliasesNormalized'> = {
        id: params.id ?? Math.random().toString(),
        name: params.name ?? 'name',
        nameIsCommon: params.nameIsCommon ?? false,
        tier: params.tier ?? '1',
        handles: params.handles ?? null,
        domains: params.domains ?? null,
        aliases: params.aliases ?? null,
    };

    return sourceSchema.parse(source);
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