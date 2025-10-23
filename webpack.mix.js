import mix from 'laravel-mix';

mix.options({
    postCss: ['@tailwindcss/postcss'],
});

mix.ts('src/js/app.ts', 'assets')
mix.css('src/css/tabbed-menu.css', 'assets')