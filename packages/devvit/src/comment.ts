import type { TriggerContext } from '@devvit/public-api';
import type { DevvitSettings, DevvitSource } from '@repo/schemas';
import { getTierDetails, getTierFlairId } from './helpers.js';
import type { PostData, SourceData } from './types.js';

function getSourceLine(source: DevvitSource) {
    const { name, handles, tier, domains } = source;
    const { commentText, reliabilityText } = getTierDetails(tier);

    const handle = handles !== null && handles.length > 0
        ? handles[0]
        : null;

    const domain = domains !== null && domains.length > 0
        ? domains[0]
        : null;

    const sourceName = handle
        ? `${name} ([@${handle.handle}](https://${handle.platform === 'x' ? 'xcancel.com' : 'bsky.app/profile'}/${handle.handle}))`
        : domain
            ? `${name} ([${domain}](https://${domain}))`
            : name;

    return `**${commentText}**: ${sourceName}${reliabilityText ? ` - ${reliabilityText}` : ''}`;
}

type HandleFlairProps = {
    postData: PostData;
    sourceData: SourceData;
    settings: DevvitSettings;
    sources: DevvitSource[];
    context: TriggerContext;
};

/**
 * Matched sources are sorted by tier.
 * Don't flair the post if:
 * - The first source is official or an aggregator.
 * - The post is a self-post.
 */
async function handleFlair({ postData, sourceData, sources, settings, context }: HandleFlairProps) {
    if (sourceData.url?.hostname && ['reddit.com', 'www.reddit.com'].includes(sourceData.url.hostname)) {
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

type SubmitCommentProps = {
    postData: PostData;
    sourceData: SourceData;
    sources: DevvitSource[];
    settings: DevvitSettings;
    context: TriggerContext;
};

export async function submitComment({ postData, sourceData, sources, settings, context }: SubmitCommentProps) {
    await handleFlair({ postData, sourceData, sources, settings, context });

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