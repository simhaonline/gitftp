<?php

return $defaults = [
    '_root_'                 => 'init',
    'hook/(:any)'            => 'hook/$1',
    'test/(:any)'            => 'test/$1',
    'async/(:any)'           => 'async/$1',
    'setup'                  => 'setup/setup/index',
    'setup/api/(:any)'       => 'setup/api/$1',
    'console/api/(:any)'     => 'console/api/$1',
    'oauth/authorize/(:any)' => 'oauth/authorize/$1',
    'login'                  => 'login/index',
    '(:any)'                 => 'init',
    '_404_'                  => 'start/404',
];
