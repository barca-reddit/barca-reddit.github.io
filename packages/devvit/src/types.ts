import type { PostCreate } from '@devvit/protos';
import type { Post } from '@devvit/public-api';
import type { processPost } from './helpers.js';

export type RedditPostV1 = Post;
export type RedditPostV2 = Exclude<PostCreate['post'], undefined>;

export type PostData = ReturnType<typeof processPost>;

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