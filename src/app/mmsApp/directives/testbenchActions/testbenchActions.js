/*globals angular*/

'use strict';

// Move this to GME eventually

angular.module('mms.testbenchActions', [
    'ngMaterial'
])
    .controller('TestbenchActionsController', function ($scope, $mdDialog, $mdToast) {

        var progressMessage,
            tooltipMessage,
            progressTooltipMessage,

            findResultById;

        tooltipMessage = 'Generate PCB';
        progressTooltipMessage = 'PCB generation in progress...';
        progressMessage = 'PCB generation in progress. It will take a couple of minutes...';

        findResultById = function (id) {

            var result;

            angular.forEach($scope.testbenchResults, function (aResult) {

                if (aResult.id === id) {
                    result = aResult;
                }

            });

            return result;

        };

        $scope.testbenchResults = [

            {

                id: 'testPCBResult1',
                name: 'Generated PCB',
                timestamp: Date.now(),
                visualUrl: 'images/testPCBResult.png',
                attachments: [
                    {
                        name: 'Download Eagle file',
                        url: 'http://google.com'
                    }
                ],
                status: 'SUCCESS'


            },

            {

                id: 'testPCBResult2',
                name: 'Generated PCB',
                timestamp: Date.now(),
                visualUrl: 'images/testPCBResult.png',
                attachments: [
                    {
                        name: 'Download Eagle file',
                        url: 'http://google.com'
                    }
                ],
                status: 'FAILURE'

            }


        ];

        $scope.setBusy = function () {

            $scope.busy = true;
            $scope.tooltipMessage = progressTooltipMessage;

        };

        $scope.setReady = function () {

            $scope.busy = false;
            $scope.tooltipMessage = tooltipMessage;

        };

        $scope.showResults = function (id, ev) {

            var result;

            function ShowResultsDialogController($scope, $mdDialog, result) {

                $scope.result = result;

                $scope.hide = function () {
                    $mdDialog.hide();
                };
                $scope.close = function () {
                    $mdDialog.hide();
                };
            }

            result = findResultById(id);

            if (angular.isObject(result)) {


                $mdDialog.show({
                    controller: ShowResultsDialogController,
                    templateUrl: '/mmsApp/templates/testbenchResult.html',
                    locals: {
                        result: result
                    },
                    targetEvent: ev
                })
                    .then(function () {
                    });
            }

        };

        $scope.startTestbench = function () {

            $scope.setBusy();

            $mdToast.show({
                    controller: 'TestbenchActionsToastController',
                    templateUrl: '/mmsApp/templates/testbenchToast.html',
                    locals: {
                        message: progressMessage
                    },
                    hideDelay: 5000
                }
            );

        };

        $scope.testbenchResultNotify = function (id) {

            var result,

                message,
                delay;

            result = findResultById(id);


            if (angular.isObject(result) && result.status === 'SUCCESS') {

                message = 'Generated PCB available.';
                delay = 0;


            } else {

                message = 'PCB generation errored.';
                delay = 0;

            }

            $mdToast.show({
                    controller: 'TestbenchActionsToastController',
                    templateUrl: '/mmsApp/templates/testbenchResultToast.html',
                    locals: {
                        result: result,
                        message: message,
                        showAction: function(id, $event){
                            $scope.showResults(id, $event);

                        }
                    },
                    hideDelay: delay
                }
            );

        };

        $scope.setReady();
//        $scope.showResults('testPCBResult1');
//        $scope.testbenchResultNotify('testPCBResult4');


    })
    .directive('testbenchActions', [
        function () {

            return {
                controller: 'TestbenchActionsController',
                restrict: 'E',
                scope: true,
                replace: true,
                transclude: true,
                templateUrl: '/mmsApp/templates/testbenchActions.html'
            };
        }])

    .controller('TestbenchActionsToastController',
    function ($scope, $mdToast, message, result, showAction) {

        $scope.result = result;

        $scope.success = false;
        $scope.success = result && result.status === 'SUCCESS';

        $scope.progressMessage = message || 'Job execution has started...';


        $scope.closeToast = function () {
            $mdToast.hide();
        };

        $scope.showResult = function($event) {

            $scope.closeToast();
            showAction(result.id, $event);

        };


    });