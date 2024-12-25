import type { Context, TriggerContext } from '@devvit/public-api';
import linkifyit from 'linkify-it';
import { fromZodError } from 'zod-validation-error';
import { settingsSchema } from './schema.js';
import type { AppSettings, RedditPostV1, Source, TierDetails } from './types.js';

const linkify = new linkifyit();

/**
 * Remove diacritics and convert to lowercase
 * 
 * @note There is a slight performance penalty when using modern unicode
 * property escapes so prefer using the old method with character class
 * range for now.
 * 
 * @see https://stackoverflow.com/a/37511463/3258251
 */
export function normalizeText(text: string) {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

export function capitalizeString(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Details:
 * 
 * order: used for sorting tiers
 * commentText: text to display in the comment
 * postFlairText: text to display in the post flair
 * reliabilityText: text to display in the comment after the source name
 * unreliable: whether the source is unreliable
 */
const tierData: Record<Source['tier'], TierDetails> = {
    official: {
        order: 0,
        commentText: 'Official',
        postFlairText: 'Official',
        reliabilityText: 'official source',
        unreliable: false
    },
    1: {
        order: 1,
        commentText: 'Tier 1',
        postFlairText: 'Tier 1',
        reliabilityText: 'very reliable',
        unreliable: false
    },
    2: {
        order: 2,
        commentText: 'Tier 2',
        postFlairText: 'Tier 2',
        reliabilityText: 'reliable',
        unreliable: false
    },
    3: {
        order: 3,
        commentText: 'Tier 3',
        postFlairText: 'Tier 3',
        reliabilityText: '❗ unreliable',
        unreliable: true
    },
    4: {
        order: 4,
        commentText: 'Tier 4',
        postFlairText: 'Tier 4',
        reliabilityText: '❗ very unreliable',
        unreliable: true
    },
    5: {
        order: 5,
        commentText: 'Tier 5',
        postFlairText: 'Tier 5',
        reliabilityText: '❗ extremely unrialable',
        unreliable: true
    },
    aggregator: {
        order: 6,
        commentText: 'Aggregator',
        postFlairText: null,
        reliabilityText: null,
        unreliable: false
    },
};

export function getTierDetails(tier: Source['tier']) {
    return tierData[tier];
}

export function getTierFlairId(tier: Source['tier'], settings: AppSettings) {
    switch (tier) {
        case '1': return settings.flairTier1Id;
        case '2': return settings.flairTier2Id;
        case '3': return settings.flairTier3Id;
        case '4': return settings.flairTier4Id;
        case '5': return settings.flairTier5Id;
        default: return null;
    }
}

export function sortTiers(a: Source, b: Source) {
    return getTierDetails(a.tier).order - getTierDetails(b.tier).order;
}

/**
 * Devvit onValidate is a bit weird, if you return string it assumes an error,
 * if you return undefined it assumes success, so here we return accordingly.
 */
export function validateSetting(key: keyof AppSettings, value: unknown) {
    const parsed = settingsSchema.shape[key].safeParse(value);

    return parsed.success
        ? undefined
        : `Invalid value for "${key}" setting. Error:\n ${fromZodError(parsed.error)}`;
}

export async function getAllSettings(context: Context | TriggerContext) {
    return settingsSchema.parse(await context.settings.getAll<AppSettings>());
}

export function isIgnoredUser(username: string, settings: AppSettings) {
    return settings.ignoredUsers
        .some(ignoredUser => ignoredUser.toLowerCase() === username.toLowerCase());
}

/**
 * This can be removed when the devvit remote tsc compiler is updated to ts 5.5+
 * @see https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/#inferred-type-predicates
 */
function nonNullable<T>(value: T): value is NonNullable<T> {
    return value !== null;
}

/**
 * Return all links in the post body, ignoring ones from reddit
 */
function getPostLinks(body: string) {
    const links = (linkify.match(body) ?? [])
        .map(link => {
            try {
                const url = new URL(link.url, 'https://www.reddit.com');
                return ['v.redd.it', 'i.redd.it', 'reddit.com', 'www.reddit.com'].includes(url.hostname) ? null : url;
            }
            catch (error) {
                return null;
            }
        })
        .filter(nonNullable);

    return links.length > 0 ? links : null;
}

export function processPost(post: RedditPostV1) {
    const url = new URL(post.url, 'https://www.reddit.com');
    const links = post.body ? getPostLinks(post.body) : null;

    return ({
        id: post.id,
        subredditName: post.subredditName,
        titleNormalized: normalizeText(post.title),
        bodyNormalized: post.body && post.body.length > 0 ? normalizeText(post.body) : null,
        url: !['v.redd.it', 'i.redd.it', 'reddit.com', 'www.reddit.com'].includes(url.hostname) ? url : null,
        links: links,
    });
}

export async function trySendPostErrorModmail(context: TriggerContext, postId: string, error: Error) {
    const { errorReportSubredditName } = await getAllSettings(context);

    if (errorReportSubredditName) {
        await context.reddit.sendPrivateMessage({
            subject: 'An error occurred with the media reliability app',
            text: `An error occurred with this post: https://redd.it/${postId.replace(/^t3_/, '')}\n\n${String(error)}`,
            to: errorReportSubredditName
        });
    }
}
