// @ts-check

/** @type {import("prettier").Config} */
const config = {
    // Standard prettier options
    singleQuote: true,
    semi: true,
    useTabs: true,
    quoteProps: 'consistent',
    singleAttributePerLine: false,
    // Since prettier 3.0, manually specifying plugins is required
    plugins: [
        '@ianvs/prettier-plugin-sort-imports',
        "@shopify/prettier-plugin-liquid",
        'prettier-plugin-tailwindcss' // must be LAST
    ],
    // Shopify liquid plugin
    liquidSingleQuote: true,
    embeddedSingleQuote: true,
    indentSchema: true,
    //Sort imports Plugin
    importOrder: ['^@core/(.*)$', '', '^@server/(.*)$', '', '^@ui/(.*)$', '', '^[./]'],
    importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
    importOrderTypeScriptVersion: '5.0.0',
    importOrderCaseSensitive: false,
};

export default config;