#!/usr/bin/env bash
set -e
composer install --no-dev --prefer-dist --optimize-autoloader
php -r "is_dir('storage/framework/views') || mkdir('storage/framework/views', 0777, true);"
php -r "is_dir('storage/framework/cache') || mkdir('storage/framework/cache', 0777, true);"
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm run build
