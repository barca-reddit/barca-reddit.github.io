import type { PostCreate } from '@devvit/protos';
import type { Post } from '@devvit/public-api';
import type { getSourceData } from './helpers.js';

export type RedditPostV1 = Post;
export type RedditPostV2 = Exclude<PostCreate['post'], undefined>;

export type SourceData = ReturnType<typeof getSourceData>;
export type PostData = Pick<Post, 'id' | 'subredditName'>;

export type ValidationResult =
    { success: true } |
    { success: false, message: string };

export type TierDetails = {
    order: number;
    postFlairText: string | null;
    commentText: string;
    reliabilityText: string | null;
    unreliable: boolean;
};