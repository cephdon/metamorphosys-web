/*globals define, console, window*/

/**
 * @author pmeijer / https://github.com/pmeijer
 */

define(['../../js/DesertFrontEnd',
        'xmljsonconverter'], function (DesertFrontEnd, Converter) {
    'use strict';

    var TestBenchController = function ($scope, $rootScope, $q, $routeParams, $location, smartClient, Chance, growl, DataStoreService, NodeService) {
        var self = this,
            nodeId = $routeParams.id;

        self.$scope = $scope;
        self.testBench = {};
        self.NS = NodeService;
        self.$q = $q;

        self.context = {
            db: 'my-db-connection-id', // TODO: this needs to be unique for this instance
            projectId: 'ADMEditor',
            branchId: 'master',
            territoryId: 'terrId1'
        };

        DataStoreService.selectProject({db: 'my-db-connection-id', projectId: 'ADMEditor'}).then(function () {
            DataStoreService.selectBranch(self.context).then(function () {
                console.log('Selected master branch..');
                self.NS.loadNode2(self.context, nodeId)
                    .then(function (node) {
                        self.initialize(node);
                    });
            });
        }).catch(function (reason) {
            console.error(reason);
        });
    };

    TestBenchController.prototype.initialize = function (testBenchNode) {
        var self = this;
        console.log('testbench node loaded.');

        self.testBench = {
            id: testBenchNode.getId(),
            name: testBenchNode.getAttribute('name'),
            description: testBenchNode.getAttribute('INFO'),
            properties: { },
            metrics: { },
            tlsut: {}
        };

        self.$scope.testBench = self.testBench;

        testBenchNode.onUpdate(function () {
            console.log(self.testBench.name, testBenchNode.getAttribute('name'));
            self.testBench.name = testBenchNode.getAttribute('name');
            console.log(self.testBench.description, testBenchNode.getAttribute('INFO'));
            self.testBench.description = testBenchNode.getAttribute('INFO');
            self.update();
        });

        self.update();
        testBenchNode.loadChildren(self.context).then(function (childNodes) {
            var i;
            for (i = 0; i < childNodes.length; i += 1) {
                console.log(childNodes[i].getAttribute('name'));
            }
        }).catch(function (reason) {
            console.error(reason);
        });

    };

    TestBenchController.prototype.atDirectChildNode = function (id) {
        var self = this;
    };

    TestBenchController.prototype.update = function () {
        if (!this.$scope.$$phase) {
            this.$scope.$apply();
        }
    };

    return TestBenchController;
});
