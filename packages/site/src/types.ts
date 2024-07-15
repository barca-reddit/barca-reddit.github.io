import type { SiteTier, SiteUpdate } from '@repo/db/types';

export type Tier = SiteTier;
export type TierData = SiteTier['data'][number];
export type TierSource = TierData['sources'][number];
export type TierRank = Tier['tier'];
export type Update = SiteUpdate;
export type Change = NonNullable<Omit<Update, 'date'>[keyof Omit<Update, 'date'>]>[number];

export type Page = 'sources' | 'tiers' | 'about' | 'updates';

export type StoreProps = {
    tierList: Tier[];
    updateList: Update[];
    lastUpdate: Date;
    page: Page;
    theme: 'light' | 'dark';
};

export type StoreActions = {
    setPage: (page: StoreProps['page']) => void;
    toggleTheme: () => void;
};