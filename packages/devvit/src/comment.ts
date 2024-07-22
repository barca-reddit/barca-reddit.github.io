import type { SetPostFlairOptions, TriggerContext } from '@devvit/public-api';
import { getTierDetails } from './helpers.js';
import type { AppSettings, PostData, Source } from './types.js';

/**
 * Matched sources are sorted by tier.
 * Don't flair the post if:
 * - The first source is official or an aggregator.
 * - The post is a self-post.
 */
function shouldFlairPost(postData: PostData, sources: Source[]) {
    if (postData.url?.hostname && ['reddit.com', 'www.reddit.com'].includes(postData.url.hostname)) {
        return false;
    }

    const { postFlairText } = getTierDetails(sources[0].tier);

    return postFlairText !== null;
}

type FlairPostProps = {
    postId: string;
    sources: Source[];
    subredditName: Exclude<SetPostFlairOptions['subredditName'], undefined>;
    flairCssClass: Exclude<SetPostFlairOptions['cssClass'], undefined>;
    flairTemplateId: Exclude<SetPostFlairOptions['flairTemplateId'], undefined>;
    context: TriggerContext;
};

export async function flairPost({ postId, sources, subredditName, flairCssClass, flairTemplateId, context }: FlairPostProps) {
    const { postFlairText } = getTierDetails(sources[0].tier);

    if (!postFlairText) {
        return;
    }

    await context.reddit.setPostFlair({
        postId,
        text: postFlairText,
        cssClass: flairCssClass,
        flairTemplateId: flairTemplateId,
        subredditName: subredditName
    });
}

function getSourceLine(source: Source) {
    const { name, handles, tier, domains } = source;
    const { commentText, reliabilityText } = getTierDetails(tier);

    const handle = handles?.at(0) ?? null;
    const domain = domains?.at(0) ?? null;

    const sourceName = handle
        ? `${name} ([@${handle}](https://twitter.com/${handle}))`
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

export async function submitComment({ postData, sources, settings, context }: SubmitCommentProps) {
    if (shouldFlairPost(postData, sources)) {
        await flairPost({
            postId: postData.id,
            sources: sources,
            subredditName: postData.subredditName,
            flairCssClass: settings.flairCssClass,
            flairTemplateId: settings.flairTemplateId,
            context: context
        });
    }

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