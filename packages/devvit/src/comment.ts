import type { TriggerContext } from '@devvit/public-api';
import { getTierDetails, getTierFlairId } from './helpers.js';
import type { AppSettings, PostData, Source } from './types.js';


type HandleFlairProps = {
    postData: PostData;
    settings: AppSettings;
    sources: Source[];
    context: TriggerContext;
};

function getSourceLine(source: Source) {
    const { name, handles, tier, domains } = source;
    const { commentText, reliabilityText } = getTierDetails(tier);

    const handle = handles?.at(0) ?? null;
    const domain = domains?.at(0) ?? null;

    const sourceName = handle
        ? `${name} ([@${handle}](https://xcancel.com/${handle}))`
        : domain
            ? `${name} ([${domain}](https://${domain}))`
            : name;

    return `**${commentText}**: ${sourceName}${reliabilityText ? ` - ${reliabilityText}` : ''}`;
}

type SubmitCommentProps = {
    postData: PostData;
    sources: Source[];
    settings: AppSettings;
    context: TriggerContext;
};

/**
 * Matched sources are sorted by tier.
 * Don't flair the post if:
 * - The first source is official or an aggregator.
 * - The post is a self-post.
 */
async function handleFlair({ postData, sources, settings, context }: HandleFlairProps) {
    if (postData.url?.hostname && ['reddit.com', 'www.reddit.com'].includes(postData.url.hostname)) {
        return false;
    }

    const flairId = getTierFlairId(sources[0].tier, settings);

    if (!flairId) {
        return;
    }

    const { postFlairText } = getTierDetails(sources[0].tier);

    if (!postFlairText) {
        return;
    }

    await context.reddit.setPostFlair({
        postId: postData.id,
        subredditName: postData.subredditName,
        flairTemplateId: flairId,
        ...settings.addTextToFlairs && { text: postFlairText },
        ...settings.flairCssClass && { cssClass: settings.flairCssClass },
    });
}

export async function submitComment({ postData, sources, settings, context }: SubmitCommentProps) {
    await handleFlair({ postData, sources, settings, context });

    const header = `**Media reliability report:**`;
    const warningForUnreliable = sources.some(source => getTierDetails(source.tier).unreliable)
        ? settings.unreliableSourcesWarning
        : null;
    const footer = settings.commentFooter;

    const markdown = [
        header,
        ...sources.map(source => `- ${getSourceLine(source)}`),
        warningForUnreliable,
        footer
    ]
        .filter(Boolean)
        .join('\n\n');

    const comment = await context.reddit.submitComment({
        id: postData.id,
        text: markdown
    });

    await Promise.all([
        comment.distinguish(true),
        comment.lock()
    ]);
}