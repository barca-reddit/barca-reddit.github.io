import {
    eslintBaseConfig,
    eslintPluginReactConfig,
    eslintPluginStylisticConfig,
    eslintPluginTypescriptConfig,
    eslintPluginUnicornConfig,
    globals,
} from "@virtuallyunknown/eslint-config";

import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginTailwindCss from "eslint-plugin-tailwindcss";

const eslintPluginTailwindCssConfig = [
    {
        plugins: {
            tailwindcss: eslintPluginTailwindCss,
        },
        rules: eslintPluginTailwindCss.configs.recommended.rules,
    },
];

const eslintPluginJsxA11yConfig = [
    {
        plugins: {
            'jsx-a11y': eslintPluginJsxA11y,
        },
        rules: eslintPluginJsxA11y.configs.recommended.rules
    },
];

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
    ...eslintBaseConfig,
    ...eslintPluginTypescriptConfig,
    ...eslintPluginUnicornConfig,
    ...eslintPluginReactConfig,
    ...eslintPluginStylisticConfig,
    ...eslintPluginTailwindCssConfig,
    ...eslintPluginJsxA11yConfig,
    {
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            globals: {
                ...globals.browser,
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