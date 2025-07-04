import type { DBSource } from '@repo/schemas';

export function getTierTitle(tier: DBSource['tier']) {
    switch (tier) {
        case 'official': return 'Official';
        case '1': return 'Tier 1';
        case '2': return 'Tier 2';
        case '3': return 'Tier 3';
        case '4': return 'Tier 4';
        case '5': return 'Tier 5';
        case 'aggregator': return 'Aggregators';
        default: return '';
    }
}

export function getTierDescription(tier: DBSource['tier']) {
    switch (tier) {
        case '1': return 'reliable';
        case '2': return 'mostly reliable';
        case '3': return 'unreliable';
        case '4': return 'very unreliable';
        case '5': return 'extremely unreliable';
        default: return '';
    }
};