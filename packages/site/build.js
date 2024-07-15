// use hashes for cache busting
import { buildReact, buildTailwind } from '@virtuallyunknown/esbuild';
import { emptyDir } from 'fs-extra';
import { copyFile, mkdir } from 'node:fs/promises';

await emptyDir('./dist');
await mkdir('./dist/img');

await Promise.all([
    copyFile('./src/index.html', './dist/index.html'),
    copyFile('./src/img/crest.png', './dist/img/crest.png'),
    copyFile('./src/img/preview.png', './dist/img/preview.png'),
    buildReact({
        outdir: 'dist',
        env: 'prod'
    }),
    buildTailwind({
        entryPoints: ['./src/tailwind.css'],
        outFile: './dist/index.css',
        env: 'prod',
    })
]);