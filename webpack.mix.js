let mix = require('laravel-mix');

mix.options({
    postCss: ['@tailwindcss/postcss'],
});

mix.js('src/js/alpine.js', 'assets')
mix.js('src/js/swiper.js', 'assets')


mix.css('src/css/app.css', 'assets')