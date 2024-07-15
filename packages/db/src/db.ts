import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import type { DB } from './db-types.js';

const { Pool } = pg;

export const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            database: process.env.dbName,
            user: process.env.dbUser,
            password: process.env.dbPass,
            host: process.env.dbHost,
            port: 5432,
        })
    }),
    plugins: [new CamelCasePlugin()],
    // log: ['query', 'error']
});