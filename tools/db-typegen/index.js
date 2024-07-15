import camelCase from 'camelcase';
import extractPGSchema from 'extract-pg-schema';
import { readFile, writeFile } from 'node:fs/promises';
import pg from 'pg';
const { extractSchemas } = extractPGSchema;

export class DbTypegen {
    /**
     * Represents a database type configuration.
     * @constructor
     * @param {{
     *   connection: {
     *         user: string,
     *         password: string,
     *         host: string,
     *         port: number,
     *         database: string
     *     };
     *     preRunSqlFiles: string[];
     *     outFile: string;
     *     prefix?: string;
     * }}
     */
    constructor({ connection, preRunSqlFiles, outFile, prefix = 'DB' }) {
        this.connection = connection;
        this.preRunSqlFiles = preRunSqlFiles ?? [];
        this.outFile = outFile;
        this.prefix = prefix;
    }

    toPascalCase(name) {
        return camelCase(name, { pascalCase: true, preserveConsecutiveUppercase: true });
    }

    toCamelCase(name) {
        return camelCase(name, { pascalCase: false, preserveConsecutiveUppercase: true });
    }

    unionize(values) {
        return values.map(v => `    '${v}'`).join(' |\n')
    }

    async getPublicSchema() {
        const schemas = await extractSchemas(this.connection);

        if (!schemas.public) {
            throw new Error('No public schema found');
        }

        return schemas.public;
    }

    async mapSchema() {
        const schema = await this.getPublicSchema();

        return ({
            enums: schema.enums.map(e => ({
                name: this.getEntityName(e.name),
                values: e.values
            })),
            tables: schema.tables.map(t => ({
                entityName: this.getEntityName(t.name),
                propName: this.toCamelCase(t.name),
                kind: 'table',
                columns: t.columns.map(c => this.mapColumn(c))
            })),
            views: schema.views.map(v => ({
                entityName: this.getEntityName(v.name),
                propName: this.toCamelCase(v.name),
                kind: 'view',
                columns: v.columns.map(c => this.mapColumn(c))
            })),
            materializedViews: schema.materializedViews.map(mv => ({
                entityName: this.getEntityName(mv.name),
                propName: this.toCamelCase(mv.name),
                kind: 'mView',
                columns: mv.columns.map(c => this.mapColumn(c))
            }))
        })
    }

    mapColumn(column) {
        if (column.type.kind !== 'base' && column.type.kind !== 'enum') {
            throw new Error(`Unsupported type kind: ${column.type.kind}`);
        }

        if (column?.references && column.references?.length > 1) {
            throw new Error('Multiple references not supported');
        }

        return ({
            name: this.toCamelCase(column.name),
            type: this.getColumnType(column),
            isPrimaryKey: column.isPrimaryKey,
            isNullable: column.isNullable,
            isUpdatable: column.isUpdatable,
            isArray: column.isArray,
            defaultValue: column.defaultValue
        })
    }

    getColumnType(column) {
        if (column?.references?.length === 1) {
            return this.getEntityName(column.references[0].tableName, column.references[0].columnName);
        }
        if (column.type.kind === 'enum') {
            return this.getEnumNameFromType(column.type.fullName);
        }
        if (column.type.kind === 'base') {
            return this.getBaseName(column);
        }
        throw new Error(`Unsupported type kind: ${column.type.kind}`);
    }

    getEntityName(tableName, columnName) {
        return columnName
            ? `${this.prefix}${this.toPascalCase(`${tableName}_${columnName}`)}`
            : `${this.prefix}${this.toPascalCase(tableName)}`
    }

    getEnumNameFromType(pgEnum) {
        const type = pgEnum.split('.').at(1);
        if (!type) {
            throw new Error(`Invalid enum type: ${pgEnum}`);
        }
        return `${this.prefix}${this.toPascalCase(type)}`;
    }

    getBaseName(column) {
        switch (column.type.fullName) {
            case 'pg_catalog.int2': return `number${column.isArray ? '[]' : ''}`;
            case 'pg_catalog.int4': return `number${column.isArray ? '[]' : ''}`;
            case 'pg_catalog.int8': return `number${column.isArray ? '[]' : ''}`;
            case 'pg_catalog.numeric': return `string${column.isArray ? '[]' : ''}`;
            case 'pg_catalog.uuid': return `string${column.isArray ? '[]' : ''}`;
            case 'pg_catalog.text': return `string${column.isArray ? '[]' : ''}`;
            case 'pg_catalog.char': return `string${column.isArray ? '[]' : ''}`;
            case 'pg_catalog.varchar': return `string${column.isArray ? '[]' : ''}`;
            case 'pg_catalog.bool': return `boolean${column.isArray ? '[]' : ''}`;
            case 'pg_catalog.timestamp': return `Date${column.isArray ? '[]' : ''}`;
            case 'pg_catalog.timestamptz': return `Date${column.isArray ? '[]' : ''}`;
            case 'pg_catalog.date': return `Date${column.isArray ? '[]' : ''}`;
            case 'pg_catalog.timetz': return `string${column.isArray ? '[]' : ''}`;
            case 'pg_catalog.json': return `object${column.isArray ? '[]' : ''}`;
            case 'pg_catalog.jsonb': return `object${column.isArray ? '[]' : ''}`;
            default:
                throw new Error(`Unsupported base type: ${column.type.fullName}`);
        }
    }

    // REMAPPED
    getEnumLine(enumColumn) {
        const values = this.unionize(enumColumn.values);
        return `export type ${enumColumn.name} = \n${values};`;
    }

    // REMAPPED
    getIdentifierLine(table) {
        const primaryKeyColumn = table.columns.find(c => c.isPrimaryKey);

        if (!primaryKeyColumn) {
            return '';
        }

        const name = this.toPascalCase(`${table.entityName}_${primaryKeyColumn.name}`);
        return `export type ${name} = ${primaryKeyColumn.type};`;
    }

    // REMAPPED
    getColumnTypeLine(table, column) {
        if (table.kind === 'table') {
            const selectable = column.isNullable ? `${column.type} | null` : column.type;
            const insertable = (column.isNullable || column.defaultValue) ? `${column.type} | null` : column.type;
            const updateable = column.isUpdatable ? `${column.type} | null` : 'never';

            return `ColumnType<${selectable}, ${insertable}, ${updateable}>`;
        }

        const selectable = column.isNullable ? `${column.type} | null` : column.type;
        return `ColumnType<${selectable}, never, never>`;
    }

    // REMAPPED
    getTableLine(tableLike) {
        const props = [];

        for (const column of tableLike.columns) {
            props.push(`    ${column.name}: ${this.getColumnTypeLine(tableLike, column)};`);
        }

        return `export interface ${tableLike.entityName} {\n${props.join('\n')}\n};`
    }

    // REMAPPED
    getKyselyExportsLine(tableLike) {
        if (tableLike.kind === 'table') {
            return [
                `export type ${tableLike.entityName}Selectable = Selectable<${tableLike.entityName}>;`,
                `export type ${tableLike.entityName}Insertable = Insertable<${tableLike.entityName}>;`,
                `export type ${tableLike.entityName}Updateable = Updateable<${tableLike.entityName}>;`,
            ].join('\n');
        }

        return `export type ${tableLike.entityName}Selectable = Selectable<${tableLike.entityName}>;`
    }

    getDatabaseLine(tables, views, materializedViews) {
        const props = [];

        for (const table of tables) {
            props.push(`    ${table.propName}: ${table.entityName};`);
        }

        for (const view of views) {
            props.push(`    ${view.propName}: ${view.entityName};`);
        }

        for (const mView of materializedViews) {
            props.push(`    ${mView.propName}: ${mView.entityName};`);
        }

        return `export interface DB {\n${props.join('\n')}\n};`
    }

    getDbColumnNamesLine(tables, views, materializedViews) {
        /**
         * here it probably doesn't make sense to export views and
         * materielized views, since they are not updatable
         */
        const props = [];

        for (const table of tables) {
            props.push(`    ${table.propName}: [${table.columns.map(c => `'${c.name}'`).join(', ')}],`);
        }
        for (const view of views) {
            props.push(`    ${view.propName}: [${view.columns.map(c => `'${c.name}'`).join(', ')}],`);
        }
        for (const mView of materializedViews) {
            props.push(`    ${mView.propName}: [${mView.columns.map(c => `'${c.name}'`).join(', ')}],`);
        }

        return `export const dbColumnNames: DBColumnNames = {\n${props.join('\n')}\n} as const;`
    }


    async generate() {
        if (this.preRunSqlFiles.length > 0) {
            const { Client } = pg;
            const client = new Client(this.connection);
            await client.connect();

            const files = await Promise.all(this.preRunSqlFiles.map(file => readFile(file, 'utf-8')));

            for (const file of files) {
                await client.query(file);
            }

            await client.end();
        }

        const { enums, tables, views, materializedViews } = await this.mapSchema();
        const header = `/* File generated automatically, do not edit. */`;
        const imports = `import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';`;
        const exports = `export type DBColumnNames = { readonly [K in keyof DB]: ReadonlyArray<keyof DB[K]>; };`

        const result = {
            enums: [],
            tables: [],
            views: [],
            mViews: [],
            database: '',
            columnNames: ''
        }

        for (const pgEnum of enums) {
            result.enums.push(this.getEnumLine(pgEnum));
        }

        for (const table of tables) {
            result.tables.push(this.getIdentifierLine(table));
            result.tables.push(this.getTableLine(table));
            result.tables.push(this.getKyselyExportsLine(table));
        }

        for (const view of views) {
            result.views.push(this.getTableLine(view));
            result.views.push(this.getKyselyExportsLine(view));
        }

        for (const mView of materializedViews) {
            result.mViews.push(this.getTableLine(mView));
            result.mViews.push(this.getKyselyExportsLine(mView));
        }

        result.database = this.getDatabaseLine(tables, views, materializedViews);
        result.columnNames = this.getDbColumnNamesLine(tables, views, materializedViews);

        const output = [
            header,
            imports,
            ...result.enums,
            ...result.tables,
            ...result.views,
            ...result.mViews,
            exports,
            result.database,
            result.columnNames
        ].filter(Boolean).join('\n\n');

        await writeFile(this.outFile, output, { encoding: 'utf-8' });
    }
}