# Media Reliability Bot

Extract sources from Reddit post titles, urls and descriptions. Assigns flairs with corresponding tiers, and creates a media reliability report as a comment.

Check u/mediareliability to see the bot in action.

# Setup

1. Generate your source list here:

-   https://www.jsonschemavalidator.net/s/1B8Jm00x

|     key      |                       type                        |                                                        description                                                        |
| :----------: | :-----------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------: |
|      id      |                     `string`                      |                                                         unique id                                                         |
|     name     |                     `string`                      |                                        name of the journalist, media or aggregator                                        |
| nameIsCommon |                     `boolean`                     | whether the name contains common words (eg. `sport`, `sun`). used to avoid false positives when searching text and titles |
|     tier     | `official`, `1`, `2`, `3`, `4`, `5`, `aggregator` |                                                   the tier of the entry                                                   |
|   handles    |                    `string[]`                     |                                               array of social media handles                                               |
|   domains    |                    `string[]`                     |                                    array of domains (do not include www or subdomains)                                    |
|   aliases    |                    `string[]`                     |                                                     array of aliases                                                      |

See a complete example here:

https://github.com/barca-reddit/barca-reddit.github.io/blob/master/packages/db/data/devvit-sources.json

2. Visit the app settings here:

https://developers.reddit.com/r/YOUR_SUBREDDIT_NAME/apps/mediareliability

3. Paste the source list in first field (make sure the JSON is properly formatted)

---

If you have any questions, feel free to message /u/decho on Reddit.
