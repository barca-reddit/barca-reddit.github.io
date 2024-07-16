/* eslint-disable @stylistic/function-paren-newline */

import { type InferResult } from 'kysely';
import { jsonBuildObject } from 'kysely/helpers/postgres';
import type { DBTier } from './db-types.js';
import { db } from './db.js';

export const siteTiersQuery = db
    .with('sourceData', db => db
        .selectFrom('sources')
        .leftJoin(
            eb => eb
                .selectFrom('changes')
                .distinctOn('changes.sourceId')
                .select(eb => [
                    eb.ref('changes.sourceId').as('addedOnId'),
                    eb.ref('changes.updateDate').as('addedOn'),
                ])
                .where('changes.type', '=', 'addition')
                .orderBy('changes.sourceId', 'asc')
                .orderBy('changes.updateDate', 'asc')
                .as('added'),
            join => join
                .onRef('sources.id', '=', 'added.addedOnId')
        )
        .leftJoin(
            eb => eb
                .selectFrom('changes')
                .distinctOn('changes.sourceId')
                .select(eb => [
                    eb.ref('changes.sourceId').as('updatedOnId'),
                    eb.ref('changes.updateDate').as('updatedOn'),
                ])
                .orderBy('changes.sourceId', 'asc')
                .orderBy('changes.updateDate', 'desc')
                .as('updated'),
            join => join
                .onRef('sources.id', '=', 'updated.updatedOnId')
        )
        .where('sources.removed', '=', false)
        .orderBy('sources.name', 'asc')
        .selectAll()
    )
    .with('groups', db => db
        .selectFrom('sourceData')
        .select(eb => [
            'sourceData.tier',
            'sourceData.type',
            eb.fn.jsonAgg(
                jsonBuildObject({
                    id: eb.ref('sourceData.id'),
                    name: eb.ref('sourceData.name'),
                    type: eb.ref('sourceData.type'),
                    tier: eb.ref('sourceData.tier'),
                    handles: eb.ref('sourceData.handles'),
                    domains: eb.ref('sourceData.domains'),
                    organizations: eb.ref('sourceData.organizations'),
                    addedOn: eb.ref('sourceData.addedOn'),
                    updatedOn: eb.ref('sourceData.updatedOn'),
                })
            ).as('sources')
        ])
        .groupBy(['sourceData.tier', 'sourceData.type'])
        .orderBy(['sourceData.tier', 'sourceData.type']))
    .selectFrom('groups')
    .select(eb => [
        'groups.tier',
        eb.fn.jsonAgg(
            jsonBuildObject({
                type: eb.ref('groups.type'),
                sources: eb.ref('groups.sources')
            })
        ).as('data')
    ])
    .groupBy('groups.tier')
    .compile();

export const siteUpdatesQuery = db
    .selectFrom('updates')
    .innerJoin('changes', 'changes.updateDate', 'updates.date')
    .innerJoin('sources', 'sources.id', 'changes.sourceId')
    .select(eb => [
        'updates.date',
        eb.fn.jsonAgg(
            jsonBuildObject({
                name: eb.ref('sources.name'),
                prevTier: eb.ref('changes.prevTier'),
                nextTier: eb.ref('changes.nextTier'),
            })
        )
            .filterWhere('changes.type', '=', 'addition')
            .$castTo<{ name: string, prevTier: null, nextTier: DBTier }[] | null>()
            .as('additions'),
        eb.fn.jsonAgg(
            jsonBuildObject({
                name: eb.ref('sources.name'),
                prevTier: eb.ref('changes.prevTier'),
                nextTier: eb.ref('changes.nextTier'),
            })
        )
            .filterWhere('changes.type', '=', 'removal')
            .$castTo<{ name: string, prevTier: DBTier, nextTier: null }[] | null>()
            .as('removals'),
        eb.fn.jsonAgg(
            jsonBuildObject({
                name: eb.ref('sources.name'),
                prevTier: eb.ref('changes.prevTier'),
                nextTier: eb.ref('changes.nextTier'),
            })
        )
            .filterWhere('changes.type', '=', 'promotion')
            .$castTo<{ name: string, prevTier: DBTier, nextTier: DBTier }[] | null>()
            .as('promotions'),
        eb.fn.jsonAgg(
            jsonBuildObject({
                name: eb.ref('sources.name'),
                prevTier: eb.ref('changes.prevTier'),
                nextTier: eb.ref('changes.nextTier'),
            })
        )
            .filterWhere('changes.type', '=', 'demotion')
            .$castTo<{ name: string, prevTier: DBTier, nextTier: DBTier }[] | null>()
            .as('demotions'),
    ])
    .groupBy('updates.date')
    .orderBy('updates.date', 'desc')
    .compile();

export const devvitSourcesQuery = db
    .selectFrom('sources')
    .leftJoin('aliases', 'aliases.sourceId', 'sources.id')
    .select(eb => [
        'sources.id',
        'sources.name',
        'sources.tier',
        'sources.domains',
        'sources.handles',
        eb.fn<string>('unaccent', [eb.fn('lower', ['sources.name'])]).as('nameNormalized'),
        eb
            .fn
            .jsonAgg(
                jsonBuildObject({
                    alias: eb.ref('aliases.alias'),
                    aliasNormalized: eb.fn<string>('unaccent', [eb.fn('lower', ['aliases.alias'])]),
                    aliasIsCommon: eb.ref('aliases.aliasIsCommon'),
                })
            )
            .filterWhere('aliases.id', 'is not', null)
            .$castTo<{ alias: string, aliasNormalized: string, aliasIsCommon: boolean }[] | null>()
            .as('aliases')
    ])
    .where('sources.removed', '=', false)
    .groupBy('sources.id')
    .orderBy(['sources.tier', 'sources.type', 'sources.name'])
    .compile();

export type SiteTier = InferResult<typeof siteTiersQuery>[number];
export type SiteUpdate = InferResult<typeof siteUpdatesQuery>[number];
export type DevvitSource = InferResult<typeof devvitSourcesQuery>[number];