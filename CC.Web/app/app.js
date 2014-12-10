﻿(function () {
    'use strict';
    
    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)

        // Custom modules 
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions

        // 3rd Party Modules
        'breeze.angular',    // Angular
        'breeze.directives', // directives
        'ui.bootstrap'       // ui-bootstrap (ex: carousel, pagination, dialog)

    ]);
    
    // Handle routing errors and success events
    app.run(['$route', 'routemediator',
        function ($route, routemediator) {
           // Include $route to kick start the router.
           //breeze.core.extendQ($rootScope, $q); - not needed in the latest breeze-angular-hottowel implementation
           routemediator.setRoutingHandlers();
    }]);
})();