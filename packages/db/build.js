import { DbTypegen } from '@repo/db-typegen';
import { buildNode } from '@virtuallyunknown/esbuild';

const dbTypegen = new DbTypegen({
    connection: {
        database: process.env.dbName,
        user: process.env.dbUser,
        password: process.env.dbPass,
        host: process.env.dbHost,
        port: 5432,
    },
    outFile: 'src/db-types.ts',
    preRunSqlFiles: ['src/sql/config.sql', 'src/sql/init.sql']
});


await dbTypegen.generate();
await buildNode({});