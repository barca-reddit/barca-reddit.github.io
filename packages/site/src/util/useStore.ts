import siteMeta from '@repo/db/data/site-meta.json';
import tierList from '@repo/db/data/site-tiers.json';
import updateList from '@repo/db/data/site-updates.json';
import type { SiteTier, SiteUpdate } from '@repo/db/types';
import { createWithEqualityFn } from 'zustand/traditional';
import type { StoreActions, StoreProps } from '../types.js';
import { getCurrentPageFromHash, getCurrentTheme } from './index.js';

/**
 * Map date strings to Date objects since we're importing from JSON
 */
export const useStore = createWithEqualityFn<StoreProps & StoreActions>()((set, get) => ({
    tierList: tierList.map(tier => ({
        ...tier,
        data: tier.data.map(data => ({
            ...data,
            sources: data.sources.map(source => ({
                ...source,
                addedOn: new Date(source.addedOn),
                updatedOn: new Date(source.updatedOn),
            }))
        }))
    })) as SiteTier[],
    updateList: updateList.map(update => ({
        ...update,
        date: new Date(update.date),
    })) as SiteUpdate[],
    page: getCurrentPageFromHash(),
    theme: getCurrentTheme(),
    lastUpdate: new Date(siteMeta.lastUpdate),
    setPage(page) {
        set({ page });
    },
    toggleTheme() {
        if (get().theme === 'light') {
            localStorage.setItem('theme', 'dark');
            document.documentElement.classList.add('dark');
            set({ theme: 'dark' });
        }

        else {
            localStorage.setItem('theme', 'light');
            document.documentElement.classList.remove('dark');
            set({ theme: 'light' });
        }
    },
}));