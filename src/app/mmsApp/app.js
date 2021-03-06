/*globals angular, ga, encodeURIComponent, Stats*/

'use strict';

require('./libraryDependencies');

require('./utils.js');

require('./services/mmsUtils/mmsUtils.js');
require('./services/errorReporter/errorReporter.js');

require('./services/ProjectHandling/ProjectHandling.js');
require('./services/connectionHandling/connectionHandling.js');

require('./services/operationsManager/operationsManager.js');

require('./services/diagramService/diagramService.js');
require('./services/gridService/gridService.js');
require('./services/wiringService/wiringService.js');
require('./services/dndService/dndService.js');
require('./services/pcbService/pcbService.js');
require('./services/primitivesService/primitivesService.js');
require('./services/connectorService/connectorService.js');

require('./directives/headerButtons/headerButtons.js');
require('./directives/socialMediaButtons/socialMediaButtons.js');

require('./directives/symbols/componentSymbol.js');

require('./directives/resizing/resizeToHeight.js');
require('./directives/resizing/resizeToWindow.js');

require('./directives/busyCover/busyCover.js');
require('./directives/processingCover/processingCover.js');

require('./directives/designEditor/designEditor');

require('./directives/mainNavigator/mainNavigator');

require('./directives/designSelector/designSelector');



var CyPhyApp = angular.module('CyPhyApp', [

    'mms.mmsApp.config',

    'ui.router',

    'gme.services',

    'isis.ui.components',

    'cyphy.components',

    // app specific templates
    'cyphy.mmsApp.templates',

    'mms.utils',
    'mms.errorReporter',

    'mms.connectionHandling',
    'mms.projectHandling',
    'mms.headerButtons',
    'mms.socialMediaButtons',

    'mms.designVisualization.operationsManager',
    'mms.designVisualization.wiringService',
    'mms.designVisualization.diagramService',

    'mms.designVisualization.symbols',
    'mms.resizeToWindow',
    'mms.designVisualization.busyCover',
    'mms.designVisualization.processingCover',
    'mms.designEditor',
    'mms.mainNavigator',

    'mms.dndService',

    'angucomplete-alt',
    'ngTouch',
    'ngMaterial',
    'ngAnimate',
    'ngCookies',

    'xeditable',


    'mms.designSelector',

    // Component Browser

    'mms.componentBrowser',
    'mms.componentBrowser.componentLibrary',

    // Subcircuit Browser

    'mms.subcircuitBrowser',
    'mms.subcircuitBrowser.subcircuitLibrary'

]);

require('./appInit');
require('./appConfig');

CyPhyApp.run(function(editableOptions, editableThemes) {
    editableThemes.bs3.buttonsClass = 'md-raised md-primary md-button md-default-theme';
    editableOptions.theme = 'bs3';
});

CyPhyApp.controller('AppController', function($rootScope, $cookies, $state, $q, $log,
    $timeout, projectHandling, $animate, $injector, $mdDialog) {

    var stateBeforeWentWrong;

    $rootScope.busy = true;

    $rootScope.retry = function() {

        var deferred;

        deferred = $q.defer();

        if ($state.current.name === 'disconnected' || $state.current.name === '404') {
            if (stateBeforeWentWrong && stateBeforeWentWrong.name !== '') {

                $state.go(stateBeforeWentWrong.name, stateBeforeWentWrong.params).then(
                    function() {
                        deferred.resolve();
                    },
                    function() {
                        deferred.reject();
                    }
                );

            } else {
                document.location.reload();
                deferred.resolve();
            }
        }

        return deferred.promise;
    };

    ga('create', 'UA-58522767-1', {
        'userId': $cookies.webgmeSid
    });

    // ga('send', 'pageview'); disable this if you use angulartics


    //window.dragStart = function(evt) {
    //    console.log('--------------' + evt);
    //    evt.dataTransfer.effectAllowed = 'copy';
    //    evt.dataTransfer.dropEffect = 'copy';
    //};

    $rootScope.$watch('disconnected', function(disconnected) {


        if (disconnected === true) {

            $state.go('disconnected');

        } else {

            $rootScope.retry();

        }

    });

    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {

        if (to.name === 'disconnected') {

            stateBeforeWentWrong = {
                name: from.name,
                params: fromParams
            };

        }

        $log.debug('stateChangeSuccess', to);

    });


    $rootScope.$on('$stateChangeStart', function(ev, to) {

        $mdDialog.hide();

        $log.debug('stateChangeStart', to);

    });

    $rootScope.$on('$stateChangeError', function(ev, to) {

        $log.error('stateChangeError', to);

    });

    $rootScope.$on('$stateNotFound', function(ev, to) {

        $log.error('stateNotFound', to);

    });

    $rootScope.$on('containerMustBeOpened', function(ev, container) {

        console.log('Go to container', container.id);

        if (container && container.id !== projectHandling.getSelectedContainerId()) {

            $rootScope.setProcessing();

            $timeout(function() {

                $state.go('editor.design', {
                        projectId: $state.params.projectId,
                        branchId: $state.params.branchId,
                        workspaceId: $state.params.workspaceId,
                        designId: $state.params.designId,
                        containerId: encodeURIComponent(container.id)
                    })
                    .catch(function(e) {
                        $log.error(e);
                    });
            });

        }
    });

    $rootScope.$on('designMustBeOpened', function(ev, design) {

        console.log('Go to design', design.id);

        if (design && design.id !== projectHandling.getSelectedDesignId()) {

            $rootScope.setProcessing();
            $timeout(function() {

                $state.go('editor.design', {
                        projectId: $state.params.projectId,
                        branchId: $state.params.branchId,
                        workspaceId: $state.params.workspaceId,
                        designId: encodeURIComponent(design.id),
                        containerId: null
                    })
                    .catch(function(e) {
                        $log.error(e);
                    });
            });

        }
    });

    $animate.enabled(true);

    function initStats() {

        var stats = new Stats(),
            step;

        step = function() {
            stats.end();
            stats.begin();
            window.requestAnimationFrame(step);
        };

        stats.setMode(0);
        document.body.appendChild(stats.domElement);

        window.requestAnimationFrame(step);

    }

    if ($injector.has('showStats') && $injector.get('showStats') === true) {
        initStats();
    }

    if ($injector.has('buildHash')) {
        $rootScope.buildHash = $injector.get('buildHash');
    }


    ga('send', 'event', 'appInitialized', $rootScope.buildHash);

});



CyPhyApp.controller('DisconnectedController', function($rootScope) {

    var self = this;

    this.clickRetry = function() {

        self.leftBehind = true;
        $rootScope.retry()
            .catch(function() {
                self.leftBehind = false;
            });

    };

    $rootScope.stopBusy();
    $rootScope.cover();

});
