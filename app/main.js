"use strict";

var API_CONNECTION_ERROR = 'Connection could not be established';

$script([
    'app/directives/ui.js',
    'app/services/utils.js',
    'app/services/auth.js',
    'app/services/service.js',
    'app/pages/home/home.js',
    'app/app.js'
], function () {
    angular.bootstrap(document, ['App']);
});