# Media Reliability Bot

Extract sources from Reddit post titles, urls and descriptions. Assigns flairs with corresponding tiers, and creates a media reliability report as a comment.

Check u/mediareliability to see the bot in action.

# Schema definitions

## Sources

|     key      |                       type                        |                                                        description                                                        |
| :----------: | :-----------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------: |
|      id      |                     `string`                      |                                                         unique id                                                         |
|     name     |                     `string`                      |                                        name of the journalist, media or aggregator                                        |
| nameIsCommon |                     `boolean`                     | whether the name contains common words (eg. `sport`, `sun`). used to avoid false positives when searching text and titles |
|     tier     | `official`, `1`, `2`, `3`, `4`, `5`, `aggregator` |                                                   the tier of the entry                                                   |
|     type     |  `official`, `journalist`, `media`, `aggregator`  |                                                   the type of the entry                                                   |
|   handles    |                `JSON[]` or `null`                 |                                               array of social media handles                                               |
|   aliases    |                `JSON[]` or `null`                 |                                                     array of aliases                                                      |
|   domains    |               `string[]` or `null`                |                                    array of domains (do not include www or subdomains)                                    |

## Handles

|   key    |    type     |              description              |
| :------: | :---------: | :-----------------------------------: |
|  handle  |  `string`   |          name of the handle           |
| platform | `x`, `bsky` | the platform where the handle is used |

## Aliases

|      key      |   type    |               description               |
| :-----------: | :-------: | :-------------------------------------: |
|     alias     | `string`  |            name of the alias            |
| aliasIsCommon | `boolean` | whether the alias contains common words |

# Setup

1. Generate your source list here:

[https://www.jsonschemavalidator.net/s/3FEqXW38](https://www.jsonschemavalidator.net/s/3FEqXW38)

Example:

```json
[
    {
        "id": "1",
        "name": "Fabrizio Romano",
        "nameIsCommon": false,
        "type": "journalist",
        "tier": "1",
        "handles": [
            {
                "handle": "FabrizioRomano",
                "platform": "x"
            }
        ],
        "domains": null,
        "aliases": [
            {
                "alias": "Taprizio",
                "aliasIsCommon": false
            }
        ]
    },
    {
        "id": "1",
        "name": "Barca Reddit",
        "nameIsCommon": false,
        "type": "aggregator",
        "tier": "aggregator",
        "handles": [
            {
                "handle": "barcareddit",
                "platform": "bsky"
            }
        ],
        "domains": null,
        "aliases": null
    }
]
```

2. Visit the app settings here:

[https://developers.reddit.com/r/YOUR_SUBREDDIT_NAME/apps/mediareliability](https://developers.reddit.com/r/YOUR_SUBREDDIT_NAME/apps/mediareliability)

3. Paste the source list in first field (make sure the JSON is properly formatted)

---

If you have any questions, feel free to message /u/decho on Reddit.
