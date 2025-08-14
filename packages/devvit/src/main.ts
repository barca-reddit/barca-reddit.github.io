import { Devvit } from '@devvit/public-api';
import { submitComment } from './comment.js';
import { getAllSettings, getPostData, getSourceData, isIgnoredUser, trySendPostErrorModmail, validateSetting } from './helpers.js';
import { findSourcesInPost } from './matcher.js';

Devvit.configure({
    redditAPI: true,
    // http: {
    //     enabled: true,
    //     domains: [
    //         'media-reliability.barcareddit.workers.dev'
    //     ]
    // }
});

Devvit.addSettings([
    {
        type: 'paragraph',
        name: 'sources',
        label: 'List of media reliability sources in JSON format',
        helpText: 'Visit the documentation for more information.',
        scope: 'installation',
        defaultValue: '[]',
        placeholder: 'Paste JSON array here',
        onValidate: ({ value }) => {
            return validateSetting('sources', value);
        }
    },
    {
        type: 'group',
        label: 'Flair settings',
        helpText: 'Note: If you want to use the same flair for all tier sources, you can use the same flair ID for all fields.',
        fields: [
            {
                type: 'string',
                name: 'flairTier1Id',
                label: 'Flair tier 1 id',
                helpText: 'The flair id to apply when assigning the flair for tier 1 sources.',
                scope: 'installation',
                defaultValue: '',
                placeholder: 'Enter flair id here',
                onValidate: ({ value }) => {
                    return validateSetting('flairTier1Id', value);
                }
            },
            {
                type: 'string',
                name: 'flairTier2Id',
                label: 'Flair tier 2 id',
                helpText: 'The flair id to apply when assigning the flair for tier 2 sources.',
                scope: 'installation',
                defaultValue: '',
                placeholder: 'Enter flair id here',
                onValidate: ({ value }) => {
                    return validateSetting('flairTier2Id', value);
                }
            },
            {
                type: 'string',
                name: 'flairTier3Id',
                label: 'Flair tier 3 id',
                helpText: 'The flair id to apply when assigning the flair for tier 3 sources.',
                scope: 'installation',
                defaultValue: '',
                placeholder: 'Enter flair id here',
                onValidate: ({ value }) => {
                    return validateSetting('flairTier3Id', value);
                }
            },
            {
                type: 'string',
                name: 'flairTier4Id',
                label: 'Flair tier 4 id',
                helpText: 'The flair id to apply when assigning the flair for tier 4 sources.',
                scope: 'installation',
                defaultValue: '',
                placeholder: 'Enter flair id here',
                onValidate: ({ value }) => {
                    return validateSetting('flairTier4Id', value);
                }
            },
            {
                type: 'string',
                name: 'flairTier5Id',
                label: 'Flair tier 5 id',
                helpText: 'The flair id to apply when assigning the flair for tier 5 sources.',
                scope: 'installation',
                defaultValue: '',
                placeholder: 'Enter flair id here',
                onValidate: ({ value }) => {
                    return validateSetting('flairTier5Id', value);
                }
            },
            {
                type: 'string',
                name: 'flairCssClass',
                label: 'Flair CSS class',
                helpText: 'The CSS class to apply when assigning the flair.',
                scope: 'installation',
                defaultValue: '',
                placeholder: 'Enter flair CSS class here',
                onValidate: ({ value }) => {
                    return validateSetting('flairCssClass', value);
                }
            },
        ]
    },
    {
        type: 'paragraph',
        name: 'unreliableSourcesWarning',
        label: 'Unreliable sources warning',
        helpText: 'The warning text to append to each media report comment if unreliable sources are found in the post. Markdown is supported.',
        defaultValue: '❗ Readers beware: This post contains information from unreliable and/or untrustworthy source(s). As such, we highly encourage our userbase to question the authenticity of any claims or quotes presented by it before jumping into conclusions or taking things as a fact.',
        scope: 'installation',
        onValidate: ({ value }) => {
            return validateSetting('unreliableSourcesWarning', value);
        }
    },
    {
        type: 'paragraph',
        name: 'commentFooter',
        label: 'Comment footer',
        helpText: 'The footer text to append at the end of each media report comment. Markdown is supported.',
        defaultValue: '',
        scope: 'installation',
        onValidate: ({ value }) => {
            return validateSetting('commentFooter', value);
        }
    },
    {
        type: 'paragraph',
        name: 'ignoredUsers',
        label: 'Comma separated list of users to ignore.',
        helpText: 'Posts by these users will not trigger any bot actions.',
        defaultValue: 'AutoModerator',
        onValidate: ({ value }) => {
            return validateSetting('ignoredUsers', value);
        }
    },
    {
        type: 'boolean',
        name: 'analyzeNamesInBody',
        label: 'Analyze post body for source names',
        helpText: 'If enabled, the bot will analyze the post body for source names.',
        defaultValue: true,
        onValidate: ({ value }) => {
            return validateSetting('analyzeNamesInBody', value);
        }
    },
    {
        type: 'boolean',
        name: 'analyzeHandlesInBody',
        label: 'Analyze post body for source handles',
        helpText: 'If enabled, the bot will analyze the post body for source handles.',
        defaultValue: true,
        onValidate: ({ value }) => {
            return validateSetting('analyzeHandlesInBody', value);
        }
    },
    {
        type: 'boolean',
        name: 'analyzeLinksInBody',
        label: 'Analyze post body for domain names',
        helpText: 'If enabled, the bot will analyze the post body for links.',
        defaultValue: true,
        onValidate: ({ value }) => {
            return validateSetting('analyzeLinksInBody', value);
        }
    },
    {
        type: 'boolean',
        name: 'addTextToFlairs',
        label: 'Add custom text to flairs',
        helpText: 'If enabled, the bot will add custom text to the flairs containing the text Tier 1,2,3,4,5.',
        defaultValue: false,
        onValidate: ({ value }) => {
            return validateSetting('addTextToFlairs', value);
        }
    },
    {
        type: 'string',
        name: 'errorReportSubredditName',
        label: 'Subrreddit name to send modmail for app error reports',
        helpText: 'The subreddit name to send modmail to in case of an error. Set it to your own subreddit to receive error reports in modmail or leave it blank. You can also set it to "barcadev".',
        defaultValue: '',
        scope: 'installation',
        onValidate: ({ value }) => {
            return validateSetting('errorReportSubredditName', value);
        }
    }
]);

Devvit.addTrigger({
    event: 'PostSubmit',
    onEvent: async (event, context) => {
        try {
            if (!event.post?.id || !event.subreddit?.name || !event.author?.name) {
                throw new Error('PostSubmit event missing post id, subreddit name or author name.');
            }

            /**
             * When dealing with crossposts, we need to do the following:
             * 
             * 1) For source extracting and processing, use the crosspost
             * from the foreign subreddit itself, because it's likely that
             * it will contain more sources and information than the
             * original post where the app is installed.
             * 
             * 2) When we pass postData to the function that deals with
             * submitting the comment, we need to pass the postId and
             * subredditName of the original post, not the crosspost.
             * This is because the comment will be submitted in the
             * original post subreddit, not the crosspost subreddit.
             * We also don't have permission to submit comments outside
             * of the original post subreddit.
             * 
             * event.post.crosspostParentId is an empty string (falsy value)
             * if the post is not a crosspost.
             * @see https://developer.mozilla.org/en-US/docs/Glossary/Falsy
             */

            const isCrossPost = !!event.post.crosspostParentId;

            const [subredditPost, crossPost] = await Promise.all([
                context.reddit.getPostById(event.post.id),
                isCrossPost
                    ? context.reddit.getPostById(event.post.crosspostParentId)
                    : Promise.resolve(null)
            ]);

            const sourceData = getSourceData(crossPost ?? subredditPost);
            const postData = getPostData(subredditPost);
            const settings = await getAllSettings(context);

            if (isIgnoredUser(event.author.name, settings)) {
                return;
            }

            const sources = findSourcesInPost(sourceData, settings);

            if (!sources) {
                return;
            }

            await submitComment({ postData, sourceData, sources, settings, context });

        }
        catch (error) {
            console.error(error);

            if (error instanceof Error && event.post?.id) {
                await trySendPostErrorModmail(context, event.post.id, error);
            }
        }
    }
});

Devvit.addMenuItem({
    label: 'Log found sources (mediareliability)',
    location: 'post',
    async onPress(event, context) {
        const post = await context.reddit.getPostById(event.targetId);
        const sourceData = getSourceData(post);

        const settings = await getAllSettings(context);
        const sources = findSourcesInPost(sourceData, settings);

        context.ui.showToast('Check app logs for debugging information.');
        console.log(JSON.stringify(sources, null, 2));
    },
});

export default Devvit;