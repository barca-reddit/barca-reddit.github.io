import type { DevvitSettings, DevvitSource } from '@repo/schemas';
import { sortTiers } from './helpers.js';
import type { SourceData } from './types.js';

export function findSourcesInPost(data: SourceData, settings: DevvitSettings) {
    const list = new Map<string, DevvitSource>();

    findMatchesInTitle(data.titleNormalized, settings.sources, list);

    if (data.url) {
        findMatchesInUrl(data.url, settings.sources, list);
    }

    if (data.links && settings.analyzeLinksInBody) {
        findMatchesInLinks(data.links, settings.sources, list);
    }

    if (data.bodyNormalized && (settings.analyzeNamesInBody || settings.analyzeHandlesInBody)) {
        findMatchesInBody(data.bodyNormalized, settings, list);
    }

    const result = Array
        .from(list.values())
        .sort(sortTiers);

    return result.length > 0 ? result : null;
}

function findMatchesInTitle(titleNormalized: string, sources: DevvitSource[], list: Map<string, DevvitSource>) {
    for (const source of sources) {
        if (isNameInTitle({ titleNormalized, source })) {
            list.set(source.id, source);
        }
        else if (isAliasInTitle({ titleNormalized, source })) {
            list.set(source.id, source);
        }
        else if (isHandleInTitle({ titleNormalized, source })) {
            list.set(source.id, source);
        }
    }
}

function findMatchesInUrl(url: URL, sources: DevvitSource[], list: Map<string, DevvitSource>) {
    for (const source of sources) {
        if (isHandleInUrl({ url, source })) {
            list.set(source.id, source);
        }
        else if (isDomainInUrl({ url, source })) {
            list.set(source.id, source);
        }
    }
}

function findMatchesInLinks(urls: URL[], sources: DevvitSource[], list: Map<string, DevvitSource>) {
    for (const source of sources) {
        if (isHandleInLinks({ urls, source })) {
            list.set(source.id, source);
        }
        else if (isDomainInLinks({ urls, source })) {
            list.set(source.id, source);
        }
    }
}

function findMatchesInBody(bodyNormalized: string, settings: DevvitSettings, list: Map<string, DevvitSource>) {
    for (const source of settings.sources) {
        if (settings.analyzeNamesInBody && isNameInBody({ bodyNormalized, source })) {
            list.set(source.id, source);
        }
        else if (settings.analyzeNamesInBody && isAliasInBody({ bodyNormalized, source })) {
            list.set(source.id, source);
        }
        else if (settings.analyzeHandlesInBody && isHandleInBody({ bodyNormalized, source })) {
            list.set(source.id, source);
        }
    }
}

/**
 * Check if `source.nameNormalized` matches against a title.
 * 
 * If `source.nameIsCommon` is `true`, ONLY match these patterns:
 * 
 * @example```txt
 * name: rest of the title
 * title which includes (name)
 * title which includes [name]
 * ```
 * 
 * If `source.nameIsCommon` is `false`, match whole word:
 * 
 * @example```txt
 * title which includes name anywhere
 * ```
 * 
 * @devnote Double escape template literal RegExp
 */
function isNameInTitle({ titleNormalized, source }: { titleNormalized: string, source: DevvitSource }) {
    if (source.nameIsCommon) {
        return new RegExp(`^${source.nameNormalized}:|(\\(|\\[)${source.nameNormalized}(\\)|\\])`, 'i').test(titleNormalized);
    }

    return new RegExp(`\\b${source.nameNormalized}\\b`, 'i').test(titleNormalized);
}

/**
 * Check if source.aliasesNormalized.[n].aliasNormalized matches against a title.
 * 
 * If `source.aliasesNormalized.[n].aliasIsCommon` is `true`, ONLY match these patterns:
 * 
 * @example```txt
 * alias: rest of the title
 * title which includes (alias)
 * title which includes [alias]
 * ```
 * 
 * If `source.aliasesNormalized.[n].aliasIsCommon` is `false`, match whole word:
 * 
 * @example```txt
 * title which includes alias anywhere
 * ```
 * 
 * @devnote Double escape template literal RegExp
 */
function isAliasInTitle({ titleNormalized, source }: { titleNormalized: string, source: DevvitSource }) {
    if (!source.aliasesNormalized) {
        return false;
    }

    return source.aliasesNormalized
        .some(({ aliasIsCommon, aliasNormalized }) => aliasIsCommon
            ? new RegExp(`^${aliasNormalized}:|(\\(|\\[)${aliasNormalized}(\\)|\\])`, 'i').test(titleNormalized)
            : new RegExp(`\\b${aliasNormalized}\\b`, 'i').test(titleNormalized));
}

/**
 * Check if `source.handlesNormalized.[n].handleNormalized` matches against a title.
 * Only match the following patterns:
 * 
 * @example```txt
 * ‌@handle: rest of the title
 * title which includes (handle)
 * title which includes [handle]
 * title which includes ‌@handle
 * ```
 * 
 * @devnote Example uses zero-width non-joiner character (U+200c) in front of the @ sign to escape it because of a bug with jsdoc.
 * @devnote Double escape template literal RegExp
 * 
 * @see https://github.com/jsdoc/jsdoc/issues/1521
 * @see https://unicode-explorer.com/c/200C
 */
function isHandleInTitle({ titleNormalized, source }: { titleNormalized: string, source: DevvitSource }) {
    if (!source.handlesNormalized) {
        return false;
    }

    return source.handlesNormalized
        .some(({ handleNormalized }) => new RegExp(`^@?${handleNormalized}:|@${handleNormalized}\\b|(\\(|\\[)${handleNormalized}(\\)|\\])`, 'i').test(titleNormalized));
}

/**
 * Check if `source.handlesNormalized.[n].handleNormalized` matches against URL pathname.
 * 
 * Only match x.com and twitter.com domains.
 * 
 * Only match the following patterns:
 * 
 * @example```txt
 * twiter.com/handle
 * twiter.com/handle/
 * twiter.com/handle/status/12345
 * x.com/handle
 * x.com/handle/
 * x.com/handle/status/12345
 * bsky.app/profile/handle
 * bsky.app/profile/handle/
 * bsky.app/profile/handle/status/12345
 * ```
 * 
 * @devnote URL pathname always starts with forward slash
 * @devnote Double escape template literal RegExp
 */
function isHandleInUrl({ url, source }: { url: URL, source: DevvitSource }) {
    if (!source.handlesNormalized) {
        return false;
    }

    if (!['x.com', 'xcancel.com', 'twitter.com', 'bsky.app'].includes(url.hostname)) {
        return false;
    }

    return source.handlesNormalized
        .some(({ handleNormalized, platform }) => {
            return platform === 'x'
                ? new RegExp(`^\\/${handleNormalized}(\\/|\\s|$)`, 'i').test(url.pathname)
                : new RegExp(`^\\/profile\\/${handleNormalized}(\\/|\\s|$)`, 'i').test(url.pathname);
        });
}

/**
 * Check if `source.domains.[n]` matches against URL hostname (domain).
 * 
 * Only match the following patterns:
 * 
 * @example```txt
 * example.com
 * www.example.com
 * sub1.example.com
 * sub1.sub2.example.com
 * ```
 * 
 * @devnote The URL constructor does NOT strip out www. prefix if present
 * @devnote Escape periods in domain names
 * @devnote Double escape template literal RegExp
 */
function isDomainInUrl({ url, source }: { url: URL, source: DevvitSource }) {
    if (!source.domains) {
        return false;
    }

    return source.domains
        .some(domain => new RegExp(`^(.*\\.)?${domain.replace(/\./g, '\\.')}$`).test(url.hostname));
}

/**
 * Check if `source.handlesNormalized.[n].handleNormalized` matches against URL list pathnames.
 * 
 * Only match x.com and twitter.com domains.
 * 
 * Only match the following patterns:
 * 
 * @example```txt
 * twiter.com/handle
 * twiter.com/handle/
 * twiter.com/handle/status/12345
 * x.com/handle
 * x.com/handle/
 * x.com/handle/status/12345
 * bsky.app/profile/handle
 * bsky.app/profile/handle/
 * bsky.app/profile/handle/status/12345
 * ```
 * 
 * @devnote Double escape template literal RegExp
 */
function isHandleInLinks({ urls, source }: { urls: URL[], source: DevvitSource }) {
    if (!source.handlesNormalized) {
        return false;
    }

    return source.handlesNormalized
        .some(({ handleNormalized, platform }) =>
            urls.some(url =>
                ['x.com', 'xcancel.com', 'twitter.com', 'bsky.app'].includes(url.hostname) &&
                    platform === 'x'
                    ? new RegExp(`^\\/${handleNormalized}(\\/|\\s|$)`, 'i').test(url.pathname)
                    : new RegExp(`^\\/profile\\/${handleNormalized}(\\/|\\s|$)`, 'i').test(url.pathname)));
}

/**
 * Check if `source.domains.[n]` matches against URL hostnames (domains) list.
 * 
 * Only match the following patterns:
 * 
 * @example```txt
 * example.com
 * www.example.com
 * sub1.example.com
 * sub1.sub2.example.com
 * ```
 * 
 * @devnote The URL constructor does NOT strip out www. prefix if present
 * @devnote Escape periods in domain names
 * @devnote Double escape template literal RegExp
 */
function isDomainInLinks({ urls, source }: { urls: URL[], source: DevvitSource }) {
    if (!source.domains) {
        return false;
    }

    return urls
        .some(url => source.domains
            ?.some(domain => new RegExp(`^(.*\\.)?${domain.replace(/\./g, '\\.')}$`).test(url.hostname)));
}

/**
 * Check if `source.nameNormalized` matches against a body.
 * 
 * If `source.nameIsCommon` is `true`, ONLY match these patterns:
 * 
 * @example```txt
 * name: rest of the body
 * body which includes (name)
 * body which includes [name]
 * ```
 * 
 * If `source.nameIsCommon` is `false`, match whole word:
 * 
 * @example```txt
 * body which includes name anywhere
 * ```
 * 
 * @devnote Double escape template literal RegExp
 */
function isNameInBody({ bodyNormalized, source }: { bodyNormalized: string, source: DevvitSource }) {
    if (source.nameIsCommon) {
        return new RegExp(`^${source.nameNormalized}:|(\\[|\\()${source.nameNormalized}(\\]|\\))`, 'im').test(bodyNormalized);
    }

    return new RegExp(`\\b${source.nameNormalized}\\b`, 'i').test(bodyNormalized);
}

/**
 * Check if `source.aliasesNormalized.[n].aliasNormalized` matches against a body.
 * 
 * If `source.aliasesNormalized.[n].aliasIsCommon` is `true`, ONLY match these patterns:
 * 
 * @example```txt
 * alias: rest of the body
 * body which includes (alias)
 * body which includes [alias]
 * ```
 * 
 * If `source.aliasesNormalized.[n].aliasIsCommon` is `false`, match whole word:
 * 
 * @example```txt
 * body which includes alias anywhere
 * ```
 * 
 * @devnote Double escape template literal RegExp
 */
function isAliasInBody({ bodyNormalized, source }: { bodyNormalized: string, source: DevvitSource }) {
    if (!source.aliasesNormalized) {
        return false;
    }

    return source.aliasesNormalized
        .some(({ aliasIsCommon, aliasNormalized }) => aliasIsCommon
            ? new RegExp(`^${aliasNormalized}:|(\\[|\\()${aliasNormalized}(\\]|\\))`, 'im').test(bodyNormalized)
            : new RegExp(`\\b${aliasNormalized}\\b`, 'i').test(bodyNormalized));
}

/**
 * Check if `source.handlesNormalized.[n].handleNormalized` matches against a body.
 * 
 * Only match the following patterns:
 * 
 * @example```txt
 * handle: rest of the body
 * ‌@handle: rest of the body
 * body which includes (handle)
 * body which includes [handle]
 * body which includes ‌@handle
 * ```
 * @devnote Example uses zero-width non-joiner character (U+200c) in front of the @ sign to escape it because of a bug with jsdoc.
 * @devnote Double escape template literal RegExp
 * 
 * @see https://github.com/jsdoc/jsdoc/issues/1521
 * @see https://unicode-explorer.com/c/200C
 */
function isHandleInBody({ bodyNormalized, source }: { bodyNormalized: string, source: DevvitSource }) {
    if (!source.handlesNormalized) {
        return false;
    }

    return source.handlesNormalized
        .some(({ handleNormalized }) => new RegExp(`^@?${handleNormalized}:|@${handleNormalized}\\b|(\\(|\\[)${handleNormalized}(\\)|\\])`, 'im').test(bodyNormalized));
}

export const __test__ = {
    isNameInTitle,
    isAliasInTitle,
    isHandleInTitle,
    isHandleInUrl,
    isHandleInLinks,
    isDomainInUrl,
    isDomainInLinks,
    isNameInBody,
    isAliasInBody,
    isHandleInBody
};