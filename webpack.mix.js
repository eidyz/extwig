const mix = require('laravel-mix');

mix.sass('assets/scss/app.scss', 'public/css');
mix.js('assets/js/app.js', 'public/js');

mix.disableSuccessNotifications();
