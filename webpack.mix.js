import mix from 'laravel-mix';

mix.options({
    postCss: ['@tailwindcss/postcss'],
});

mix.css('src/css/tabbed-menu.css', 'assets')