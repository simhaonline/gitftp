<?php
/**
 * Part of the Fuel framework.
 *
 * @package    Fuel
 * @version    1.8
 * @author     Fuel Development Team
 * @license    MIT License
 * @copyright  2010 - 2016 Fuel Development Team
 * @link       http://fuelphp.com
 */

/**
 * NOTICE:
 * If you need to make modifications to the default configuration, copy
 * this file to your app/config folder, and make them in there.
 * This will allow you to upgrade fuel without losing your custom config.
 */

return [

    /*
    | Which version of the schema should be considered "current"
    |
    |	Default: 0
    |
    */
    'version' => [
        'app'     => [
            'default' => 0,
        ],
        'module'  => [],
        'package' => [],
    ],

    /*
    | Folder name where migrations are stored relative to App, Module and Package Paths?
    |
    |	Default: 'migrations/'
    |
    */
    'folder'  => 'migrations/',

    /*
    | Table name
    |
    |	Default: 'migration'
    |
    */
    'table'   => 'migration',

];
