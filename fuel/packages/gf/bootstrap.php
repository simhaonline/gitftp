<?php

Autoloader::add_classes([
    'Gf\Misc'                           => __DIR__ . '/classes/misc.php',
    'Gf\Utils'                          => __DIR__ . '/classes/utils.php',
    'Gf\Exception\UserException'        => __DIR__ . '/classes/exception/userexception.php',
    'Gf\Exception\AppException'         => __DIR__ . '/classes/exception/appexception.php',
    'Gf\Exception\Log'                  => __DIR__ . '/classes/exception/log.php',
    'Gf\Exception\Logger'               => __DIR__ . '/classes/exception/logger.php',
    'Gf\Exception\ExceptionInterceptor' => __DIR__ . '/classes/exception/exceptioninterceptor.php',
    'Gf\Settings'                       => __DIR__ . '/classes/settings.php',
    'Gf\Auth\OAuth'                     => __DIR__ . '/classes/auth/oauth.php',
    'Gf\Auth\Auth'                      => __DIR__ . '/classes/auth/auth.php',
    'Gf\Auth\SessionManager'            => __DIR__ . '/classes/auth/sessionmanager.php',
    'Gf\Auth\Users'                     => __DIR__ . '/classes/auth/users.php',
    'Gf\Platform'                       => __DIR__ . '/classes/platform.php',
    'Gf\Config'                         => __DIR__ . '/classes/config.php',
    'Gf\Project'                        => __DIR__ . '/classes/project.php',
    'Gf\Server'                         => __DIR__ . '/classes/server.php',
    'Gf\Record'                         => __DIR__ . '/classes/record.php',
    'Gf\Git\GitApi'                     => __DIR__ . '/classes/git/gitApi.php',
    'Gf\Git\GitLocal'                   => __DIR__ . '/classes/git/gitLocal.php',
    'Gf\Git\Providers\GitInterface'     => __DIR__ . '/classes/git/providers/gitInterface.php',
    'Gf\Git\Providers\Github'           => __DIR__ . '/classes/git/providers/github.php',
    'Gf\Git\Providers\Bitbucket'        => __DIR__ . '/classes/git/providers/bitbucket.php',
    'Gf\Deploy\Deploy'                  => __DIR__ . '/classes/deploy/deploy.php',
    'Gf\Deploy\Helper\DeployLog'        => __DIR__ . '/classes/deploy/helper/deployLog.php',
    'Gf\Deploy\Helper\DeployLife'       => __DIR__ . '/classes/deploy/helper/deployLife.php',
    'Gf\Deploy\Connection'              => __DIR__ . '/classes/deploy/connection.php',
    'Gf\Deploy\Tasker\ConnectionWorker' => __DIR__ . '/classes/deploy/tasker/connectionWorker.php',
    'Gf\Deploy\Tasker\FileTask'         => __DIR__ . '/classes/deploy/tasker/fileTask.php',
    'Gf\Deploy\Tasker\Deployer'         => __DIR__ . '/classes/deploy/tasker/deployer.php',
    'Gf\WebHook'                        => __DIR__ . '/classes/webHook.php',
    'Gf\Keys'                           => __DIR__ . '/classes/keys.php'
]);

/* End of file bootstrap.php */
