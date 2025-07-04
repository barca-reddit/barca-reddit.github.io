import type { DBSource, DBUpdate } from '@repo/schemas';

export type TierTypeData = {
    type: DBSource['type'];
    sources: DBSource[];
};

export type TierData = {
    tier: DBSource['tier'];
    data: TierTypeData[];
};

export type UpdateEntry = {
    sourceName: DBUpdate['sourceName'];
    prevTier: DBUpdate['prevTier'];
    nextTier: DBUpdate['nextTier'];
};

export type UpdateData = {
    date: DBUpdate['updateDate'];
    promotions?: UpdateEntry[];
    demotions?: UpdateEntry[];
    additions?: UpdateEntry[];
    removals?: UpdateEntry[];
};

export function organizeSources(sources: DBSource[]) {
    const organized: TierData[] = [];

    for (const source of sources) {
        const { tier, type } = source;

        let tierEntry = organized.find(t => t.tier === tier);

        if (!tierEntry) {
            tierEntry = { tier, data: [] };
            organized.push(tierEntry);
        }

        let typeEntry = tierEntry.data.find(t => t.type === type);

        if (!typeEntry) {
            typeEntry = { type, sources: [] };
            tierEntry.data.push(typeEntry);
        }

        typeEntry.sources.push(source);
    }

    return organized;
}

function mapUpdateEntry(data: DBUpdate) {
    return ({ sourceName: data.sourceName, prevTier: data.prevTier, nextTier: data.nextTier });
}

export function organizeUpdates(updates: DBUpdate[]) {
    const organized: UpdateData[] = [];
    const updateDates = [...new Set(updates.map(u => u.updateDate))];

    for (const date of updateDates) {
        organized.push({
            date,
            promotions: updates.filter(u => u.updateDate === date && u.type === 'promotion').map(mapUpdateEntry),
            demotions: updates.filter(u => u.updateDate === date && u.type === 'demotion').map(mapUpdateEntry),
            additions: updates.filter(u => u.updateDate === date && u.type === 'addition').map(mapUpdateEntry),
            removals: updates.filter(u => u.updateDate === date && u.type === 'removal').map(mapUpdateEntry),
        });
    }

    return organized;
}