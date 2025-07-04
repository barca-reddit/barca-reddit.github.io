import {
    eslintBaseConfig,
    eslintPluginStylisticConfig,
    eslintPluginTypescriptConfig,
    eslintPluginUnicornConfig,
    globals,
} from '@virtuallyunknown/eslint-config';

import eslintParserTypeScript from "@typescript-eslint/parser";
import eslintParserAstro from "astro-eslint-parser";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";

const eslintPluginBetterTailwindcssConfig = [{
    files: ["**/*.astro"],
    languageOptions: {
        parser: eslintParserAstro,
        parserOptions: {
            // optionally use TypeScript parser within for Astro files
            parser: eslintParserTypeScript
        }
    },
    plugins: {
        "better-tailwindcss": eslintPluginBetterTailwindcss
    },
    rules: {
        // enable all recommended rules to report a warning
        // ...eslintPluginBetterTailwindcss.configs["recommended-warn"].rules,
        // // enable all recommended rules to report an error
        ...eslintPluginBetterTailwindcss.configs["recommended-warn"].rules,

        // // or configure rules individually
        "better-tailwindcss/enforce-consistent-line-wrapping": ["warn", { printWidth: 100, group: 'never', preferSingleLine: true, indent: 4 }],
        "better-tailwindcss/no-unregistered-classes": ["warn", { ignore: ['theme-toggle'] }],
    },
    settings: {
        "better-tailwindcss": {
            // tailwindcss 4: the path to the entry file of the css based tailwind config (eg: `src/global.css`)
            // entryPoint: "src/global.css",
            // tailwindcss 3: the path to the tailwind config file (eg: `tailwind.config.js`)
            tailwindConfig: "./packages/astro/tailwind.config.js"
        }
    }
}]

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
    ...eslintBaseConfig,
    ...eslintPluginTypescriptConfig,
    ...eslintPluginUnicornConfig,
    ...eslintPluginStylisticConfig,
    ...eslintPluginAstro.configs.recommended,
    ...eslintPluginAstro.configs['jsx-a11y-strict'],
    ...eslintPluginBetterTailwindcssConfig,
    {
        files: ['src/**/*.{ts,tsx}'],
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
                ...globals.browser,
            },
        },
        linterOptions: {
            noInlineConfig: false,
            reportUnusedDisableDirectives: true,
        },
    },
    {
        ignores: ['**/*.{js,cjs,mjs}'],
    },
    eslintConfigPrettier,
];