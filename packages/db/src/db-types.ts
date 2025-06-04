/* File generated automatically, do not edit. */

import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

export type DBSourceTier = 
    'official' |
    '1' |
    '2' |
    '3' |
    '4' |
    '5' |
    'aggregator';

export type DBSourceType = 
    'official' |
    'journalist' |
    'media' |
    'aggregator';

export type DBChangeType = 
    'addition' |
    'removal' |
    'promotion' |
    'demotion';

export type DBSourcesId = string;

export interface DBSources {
    id: ColumnType<string, string | null, string | null>;
    name: ColumnType<string, string, string | null>;
    nameIsCommon: ColumnType<boolean, boolean, boolean | null>;
    type: ColumnType<DBSourceType, DBSourceType, DBSourceType | null>;
    tier: ColumnType<DBSourceTier, DBSourceTier, DBSourceTier | null>;
    organizations: ColumnType<string[] | null, string[] | null, string[] | null>;
    handles: ColumnType<string[] | null, string[] | null, string[] | null>;
    domains: ColumnType<string[] | null, string[] | null, string[] | null>;
    removed: ColumnType<boolean, boolean | null, boolean | null>;
};

export type DBSourcesSelectable = Selectable<DBSources>;
export type DBSourcesInsertable = Insertable<DBSources>;
export type DBSourcesUpdateable = Updateable<DBSources>;

export type DBAliasesId = string;

export interface DBAliases {
    id: ColumnType<string, string | null, string | null>;
    sourceId: ColumnType<DBSourcesId, DBSourcesId, DBSourcesId | null>;
    alias: ColumnType<string, string, string | null>;
    aliasIsCommon: ColumnType<boolean, boolean, boolean | null>;
};

export type DBAliasesSelectable = Selectable<DBAliases>;
export type DBAliasesInsertable = Insertable<DBAliases>;
export type DBAliasesUpdateable = Updateable<DBAliases>;

export type DBUpdatesDate = Date;

export interface DBUpdates {
    date: ColumnType<Date, Date, Date | null>;
    link: ColumnType<string | null, string | null, string | null>;
};

export type DBUpdatesSelectable = Selectable<DBUpdates>;
export type DBUpdatesInsertable = Insertable<DBUpdates>;
export type DBUpdatesUpdateable = Updateable<DBUpdates>;

export interface DBChanges {
    type: ColumnType<DBChangeType, DBChangeType, DBChangeType | null>;
    sourceId: ColumnType<DBSourcesId, DBSourcesId, DBSourcesId | null>;
    updateDate: ColumnType<DBUpdatesDate, DBUpdatesDate, DBUpdatesDate | null>;
    prevTier: ColumnType<DBSourceTier | null, DBSourceTier | null, DBSourceTier | null>;
    nextTier: ColumnType<DBSourceTier | null, DBSourceTier | null, DBSourceTier | null>;
};

export type DBChangesSelectable = Selectable<DBChanges>;
export type DBChangesInsertable = Insertable<DBChanges>;
export type DBChangesUpdateable = Updateable<DBChanges>;

export type DBColumnNames = { readonly [K in keyof DB]: ReadonlyArray<keyof DB[K]>; };

export interface DB {
    sources: DBSources;
    aliases: DBAliases;
    updates: DBUpdates;
    changes: DBChanges;
};

export const dbColumnNames: DBColumnNames = {
    sources: ['id', 'name', 'nameIsCommon', 'type', 'tier', 'organizations', 'handles', 'domains', 'removed'],
    aliases: ['id', 'sourceId', 'alias', 'aliasIsCommon'],
    updates: ['date', 'link'],
    changes: ['type', 'sourceId', 'updateDate', 'prevTier', 'nextTier'],
} as const;