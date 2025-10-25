<?php

return [
    /*
     * Your API path. Full URL will be `https://yourdomain.com/docs/api`.
     */
    'path' => 'docs/api',

    /*
     * Your API domain. By default, app domain is used. This is also a part of
     * route definition, so you can use it to separate your API docs.
     */
    'domain' => null,

    /*
     * Here you may specify middlewares that should be applied to the API docs route.
     */
    'middleware' => [],

    /*
     * Your API version. By default, the first discovered version from route files is used.
     * Use this value in case auto-discovery doesn't work for you.
     */
    'info' => [
        'version' => '1.0.0',
        'title' => 'MileApp Task API',
        'description' => 'Task Management API with mock authentication, CRUD operations, pagination, filtering, and sorting.',
    ],

    /*
     * Customize Stoplight Elements UI
     */
    'ui' => [
        'theme' => 'default',
        'hide_try_it' => false,
    ],

    /*
     * Define servers for your API.
     */
    'servers' => [
        [
            'url' => env('APP_URL', 'http://localhost'),
            'description' => 'Local Development',
        ],
    ],
];
