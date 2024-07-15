import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import type { Page, TierRank } from '../types.js';

dayjs.extend(advancedFormat);

export { dayjs };

export function getTierTitle(tier: TierRank) {
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

export function getTierDescription(tier: TierRank) {
    switch (tier) {
        case '1': return 'reliable';
        case '2': return 'mostly reliable';
        case '3': return 'unreliable';
        case '4': return 'very unreliable';
        case '5': return 'extremely unreliable';
        default: return '';
    }
};

export function getCurrentPageFromHash(): Page {
    switch (window.location.hash) {
        case '': return 'sources';
        case '#tiers': return 'tiers';
        case '#about': return 'about';
        case '#updates': return 'updates';
        default: return 'sources';
    }
}

export function getCurrentTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
    else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

export function getTooltipPosition(container: HTMLElement, item: HTMLElement, tooltip: HTMLElement) {
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    const overflowsContainer = containerRect.bottom - itemRect.bottom < tooltipRect.height;
    const overflowsScreenEdge = itemRect.y + tooltipRect.height > window.innerHeight;

    const top = (overflowsContainer || overflowsScreenEdge)
        ? `-${tooltipRect.height}px`
        : '100%';

    let left = `calc(50% - ${tooltipRect.width / 2}px)`;

    if (tooltipRect.width > itemRect.width) {
        const spaceRight = containerRect.right - itemRect.right;
        const tooltipSideWidth = (tooltipRect.width - itemRect.width) / 2;

        if (spaceRight < tooltipSideWidth) {
            left = `-${tooltipRect.width - (spaceRight + itemRect.width) + 16}px`;
        }
    }

    return { top, left };
}