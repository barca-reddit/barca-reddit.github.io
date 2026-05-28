# GitHub Actions Migration — May 2026

## Problem Summary

The CI/CD workflow at `.github/workflows/github-pages.yaml` started failing in May 2026 due to GitHub's deprecation of Node.js 20 as the runtime for action steps.

### Error (from build run [#26579278721](https://github.com/barca-reddit/barca-reddit.github.io/actions/runs/26579278721))

```
deploy
Command pnpm recursive install --frozen-lockfile --strict-peer-dependencies (cwd: undefined) exits with status 1
```

### Warning (from the same run)

> Node.js 20 actions are deprecated. The following actions are running on Node.js 20 and may not work as expected: `actions/checkout@v4`, `actions/configure-pages@v5`, `actions/setup-node@v4`, `pnpm/action-setup@v4`. Actions will be forced to run with Node.js 24 by default starting **June 2nd, 2026**.

---

## Root Cause Analysis

GitHub began forcing actions to run under Node.js 24 instead of Node.js 20 starting June 2026. The four actions used in the workflow (`checkout@v4`, `configure-pages@v5`, `setup-node@v4`, `pnpm/action-setup@v4`) were all compiled against Node.js 20. When the runner forced them onto Node.js 24, their bundled runtimes became incompatible.

The specific crash manifested in `pnpm/action-setup@v4`'s `run_install` feature. The action's internal Node.js code failed to execute under Node.js 24, resulting in the `pnpm recursive install ... (cwd: undefined) exits with status 1` error. The `cwd: undefined` in the error message is the telltale sign that the action's own JavaScript runtime crashed before it could pass the working directory to the install subprocess — this is an action-level failure, not a pnpm-level one.

---

## Actions Audit

| Action                          | Used Version | Latest Version    | Node.js Runtime     | Action Status     |
| ------------------------------- | ------------ | ----------------- | ------------------- | ----------------- |
| `actions/checkout`              | `v4`         | **`v6`** (v6.0.2) | Node.js 24 since v5 | ❌ Outdated       |
| `actions/configure-pages`       | `v5`         | **`v6`** (v6.0.0) | Node.js 24 since v6 | ❌ Outdated       |
| `actions/setup-node`            | `v4`         | **`v6`** (v6.4.0) | Node.js 24 since v5 | ❌ Outdated       |
| `pnpm/action-setup`             | `v4`         | **`v6`** (v6.0.8) | Node.js 24 since v5 | ❌ Outdated       |
| `actions/upload-pages-artifact` | `v3`         | `v3`              | —                   | ✅ Not deprecated |
| `actions/deploy-pages`          | `v4`         | `v4`              | —                   | ✅ Not deprecated |

---

## Breaking Changes Per Action

### `actions/checkout` v4 → v6

**v5**

- Updated to the Node.js 24 runtime. Requires minimum runner version [v2.327.1](https://github.com/actions/runner/releases/tag/v2.327.1).

**v6** (latest)

- Improved credential security: `persist-credentials` now stores credentials in a separate file under `$RUNNER_TEMP` rather than directly in `.git/config`.
- No workflow changes required — `git fetch`, `git push`, etc. continue to work automatically.

### `actions/configure-pages` v5 → v6

- Updated to the Node.js 24 runtime.
- No other breaking changes relevant to this workflow.

### `actions/setup-node` v4 → v6

**v5** breaking changes:

- Upgraded to the Node.js 24 runtime. Requires minimum runner version [v2.327.1](https://github.com/actions/runner/releases/tag/v2.327.1).
- **npm auto-caching**: Caching is now automatically enabled for npm projects when `devEngines.packageManager` or top-level `packageManager` in `package.json` is set to `npm`. This project uses pnpm and has no such field, so this does **not** apply.
- The `always-auth` input was removed (deprecated).

**v6** (latest, v6.4.0)

- No additional breaking changes relevant to this workflow.

### `pnpm/action-setup` v4 → v6

- Updated to the Node.js 24 runtime (latest: v6.0.8).
- The `run_install` YAML syntax is **unchanged** — the existing configuration is fully compatible with v6.
- The `version: "latest"` input continues to work. A `packageManager` field in `package.json` would also be accepted as an alternative way to specify the pnpm version.

---

## Fix

Only the version tags in the workflow need to be bumped. No structural or configuration changes are required.

| Old                          | New                          |
| ---------------------------- | ---------------------------- |
| `actions/checkout@v4`        | `actions/checkout@v6`        |
| `actions/configure-pages@v5` | `actions/configure-pages@v6` |
| `actions/setup-node@v4`      | `actions/setup-node@v6`      |
| `pnpm/action-setup@v4`       | `pnpm/action-setup@v6`       |

### Updated `.github/workflows/github-pages.yaml`

```yaml
# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
    # Runs on pushes targeting the default branch
    push:
        branches: ['master']

    # Allows you to run this workflow manually from the Actions tab
    workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
    contents: read
    pages: write
    id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
    group: 'pages'
    cancel-in-progress: false

jobs:
    # Single deploy job since we're just deploying
    deploy:
        environment:
            name: github-pages
            url: ${{ steps.deployment.outputs.page_url }}
        runs-on: ubuntu-latest
        steps:
            - name: Checkout
              uses: actions/checkout@v6

            - name: Setup Pages
              uses: actions/configure-pages@v6

            - name: Setup Node.js
              uses: actions/setup-node@v6
              with:
                  node-version: 'latest'

            - name: Setup pnpm & install dependencies
              uses: pnpm/action-setup@v6
              with:
                  version: 'latest'
                  run_install: |
                      - recursive: true
                        args: [--frozen-lockfile, --strict-peer-dependencies]

            - name: Run type checks
              run: pnpm run check

            - name: Run lint
              run: pnpm run lint

            - name: Run tests
              run: pnpm run test

            - name: Build project
              run: pnpm run gh-pages

            - name: Upload artifact
              uses: actions/upload-pages-artifact@v3
              with:
                  path: './packages/site/dist'

            - name: Deploy to GitHub Pages
              id: deployment
              uses: actions/deploy-pages@v4
```
