import {
    eslintBaseConfig,
    eslintPluginStylisticConfig,
    eslintPluginTypescriptConfig,
    eslintPluginUnicornConfig,
    globals,
} from "@virtuallyunknown/eslint-config";

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
    ...eslintBaseConfig,
    ...eslintPluginTypescriptConfig,
    ...eslintPluginUnicornConfig,
    ...eslintPluginStylisticConfig,
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            /**
             * parserOptions.project is optional since it's
             * included in the typescript plugin configuration.
             */
            parserOptions: {
                project: true,
            },
            globals: {
                /**
                 * or other environments
                 */
                ...globals.nodeBuiltin,
            },
        },
        linterOptions: {
            noInlineConfig: false,
            reportUnusedDisableDirectives: true,
        },
    },
    {
        ignores: ["**/*.{js,cjs,mjs}"],
    },
];