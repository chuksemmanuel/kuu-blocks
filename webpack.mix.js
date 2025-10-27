import mix from 'laravel-mix';

mix.options({
    postCss: ['@tailwindcss/postcss'],
});

mix.css('src/css/tailwind.css', 'assets')

mix.ts('src/ts/vendors/alpine.ts', 'assets')
    .ts('src/ts/vendors/gsap.ts', 'assets')