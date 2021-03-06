/*globals angular */

'use strict';

var EventDispatcher = require('../../classes/EventDispatcher');

angular.module('mms.projectHandling', [])
    .service('projectHandling', function($q, $log, branchService, connectionHandling, $http, projectService, $rootScope, workspaceService,
        mmsUtils, designService, designLayoutService, $timeout, dataStoreService, $injector) {

        var self = this,
            selectedProjectId,
            selectedBranchId,
            selectedWorkspaceId,
            selectedDesignId,
            selectedContainerId,

            availableWorkspaces,
            availableDesigns,
            availableContainers,
            availableTestBenches,

            wsContext,
            designContext,
            containerLayoutContext,

            setupWSWatcher,
            cleanWSWatcher,

            setupWorkspaceInternalsWatcher,
            cleanWorkspaceInternalsWatcher,

            watchedContainers,
            childContainerWatcher,
            childContainerParser,

            setupDesignInternalsWatcher,
            cleanDesignInternalsWatcher,

            setupContainerInternalsWatcher,
            cleanContainerInternalsWatcher,

            _designConfigs = {};

        EventDispatcher.prototype.apply(this);

        this.emit = function(eventName) {
            $rootScope.$emit(eventName);
            this.dispatchEvent({type: eventName});
        };

        if ($injector.has('designsToSelect')) {

            var designsToSelect = $injector.get('designsToSelect');

            designsToSelect.forEach(function(groupOfDesigns) {
                groupOfDesigns.designs.forEach(function(design) {

                    _designConfigs[design.name] = design;

                });
            });

        }


        this.leaveProject = function() {

            if (selectedProjectId) {

                this.leaveBranch();
                this.emit('leaveProject');

                selectedDesignId = null;

            }
        };


        this.leaveBranch = function() {

            if (selectedBranchId) {

                console.log('workspaces are cleaned up');

                this.leaveWorkspace();

                cleanWSWatcher();

                this.emit('leaveBranch');

                selectedBranchId = null;

            }
        };

        this.leaveWorkspace = function() {

            if (selectedWorkspaceId) {

                this.leaveDesign();

                cleanWorkspaceInternalsWatcher();

                this.emit('leaveWorkspace');

                selectedWorkspaceId = null;

            }
        };

        this.leaveDesign = function() {

            if (selectedDesignId) {

                this.leaveContainer();

                cleanDesignInternalsWatcher();

                this.emit('leaveDesign');

                selectedDesignId = null;

            }
        };

        this.leaveContainer = function() {

            if (selectedContainerId) {

                cleanContainerInternalsWatcher();

                this.emit('leaveContainer');

                selectedContainerId = null;

            }
        };

        this.copyProject = function() {
            return $http.get('/rest/external/copyproject/noredirect');

        };

        this.cloneMaster = function() {

            var deferred;

            deferred = $q.defer();

            $rootScope.loading = true;

            connectionHandling.establishMainGMEConnection()
                .then(function(connectionId) {

                    branchService.getBranches(connectionId)
                        .then(function(branches) {

                            var newBranchId,
                                hashId;

                            $log.debug('Available branches', branches);

                            hashId = branches['master'];

                            if (!hashId) {
                                deferred.reject('Could not find master branch!');
                                return;
                            }

                            newBranchId = mmsUtils.randomString(6) + (new Date()).getTime();

                            branchService.createBranch(
                                    connectionId,
                                    newBranchId,
                                    hashId
                                )
                                .then(function() {
                                    deferred.resolve(newBranchId);
                                })
                                .catch(function(err) {
                                    deferred.reject(err);
                                });

                            $rootScope.loading = false;

                        })
                        .catch(function(error) {
                            deferred.reject(error);
                            $rootScope.loading = false;
                        });


                });

            return deferred.promise;

        };

        this.getSelectedProjectId = function() {
            return selectedProjectId;
        };

        this.selectProject = function(projectId, branchId) {

            var deferred;

            deferred = $q.defer();

            if (!projectId) {
                deferred.reject('No project specified');
            } else {

                if (projectId !== selectedProjectId) {

                    $rootScope.loading = true;

                    this.leaveProject();

                    connectionHandling.establishMainGMEConnection()
                        .then(function(connectionId) {

                            projectService.selectProject(connectionId, projectId, branchId)
                                .then(function(projectId) {

                                    selectedProjectId = projectId;
                                    $log.debug('Project selected', projectId);

                                    deferred.resolve(projectId);

                                })
                                .catch(function(reason) {
                                    $rootScope.loading = false;
                                    $log.debug('Opening project errored', projectId, reason);
                                    deferred.reject('Opening project errored');

                                });

                        })
                        .catch(function(reason) {
                            $rootScope.loading = false;
                            $log.debug('GME Connection could not be established', reason);
                            deferred.reject('GME Connection could not be established');
                        });

                } else {
                    deferred.resolve(projectId);
                }

            }

            return deferred.promise;
        };

        this.getSelectedBranchId = function() {
            return selectedBranchId;
        };

        cleanWSWatcher = function() {

            if (wsContext) {
                workspaceService.unregisterWatcher(wsContext);
                wsContext = null;

                availableWorkspaces = null;
            }

        };

        setupWSWatcher = function() {

            var deferred;

            deferred = $q.defer();

            cleanWSWatcher();

            connectionHandling.establishMainGMEConnection()
                .then(function(connectionId) {

                    wsContext = $rootScope.wsContext = {
                        db: connectionId,
                        regionId: 'WorkSpaces_' + (new Date())
                            .toISOString()
                    };

                    $log.debug('WS context is set');

                    workspaceService.registerWatcher(wsContext, function(destroyed) {

                        $log.debug('WorkSpace watcher initialized, destroyed:', destroyed);


                        // TODO: this watchers is being called even if context was cleaned up. This will cause memory leaks.
                        if (wsContext !== null) {
                            if (destroyed !== true) {
                                return workspaceService.watchWorkspaces(wsContext, function(updateObject) {


                                    // TODO: creation/removal of new workapces are NOT done
                                    if (updateObject.type === 'load') {
                                        console.log('load', updateObject);
                                    } else if (updateObject.type === 'update') {
                                        console.log('update', updateObject);
                                    } else if (updateObject.type === 'unload') {
                                        console.log('unload', updateObject);
                                    } else {
                                        throw new Error(updateObject);

                                    }

                                }).then(function(data) {
                                    availableWorkspaces = data.workspaces;

                                    $log.debug('WSWatchers are set up');

                                    deferred.resolve(data.workspaces);

                                });
                            }
                        }

                    });


                })
                .catch(function(reason) {
                    $rootScope.loading = false;
                    $log.debug('GME Connection could not be established', reason);
                    deferred.reject('GME Connection could not be established');
                });

            return deferred.promise;

        };

        cleanContainerInternalsWatcher = function() {

        };

        cleanWorkspaceInternalsWatcher = function() {

            availableDesigns = null;
            availableTestBenches = null;

            selectedDesignId = null;

            // TODO designService.unregisterWatcher(wsContext);

        };

        setupWorkspaceInternalsWatcher = function() {

            var designsPromise,
                deferred;

            deferred = $q.defer();

            cleanWorkspaceInternalsWatcher();

            designsPromise = designService.watchDesigns(wsContext, selectedWorkspaceId, function() {
                //TODO: eventually this has to be implemented
            }).then(function(designsData) {
                availableDesigns = designsData.designs;
            });

            designsPromise
                .then(function() {
                    deferred.resolve();
                })
                .catch(function() {
                    deferred.reject('Could not get designs');
                });

            return deferred.promise;

        };

        cleanDesignInternalsWatcher = function() {

            if (designContext) {
                //workspaceService.cleanUpAllRegions(wsContext);

                designContext = null;
                availableContainers = null;
                watchedContainers = null;

            }

        };

        childContainerWatcher = function(collector) {
            return function(designStructureUpdateObject) {

                if (designStructureUpdateObject.data && designStructureUpdateObject.data.baseName === 'Container') {

                    switch (designStructureUpdateObject.type) {

                        case 'load':

                            $timeout(function() {

                                availableContainers = availableContainers || {};
                                availableContainers[designStructureUpdateObject.data.id] = designStructureUpdateObject.data;

                                if (angular.isObject(collector)) {
                                    collector[designStructureUpdateObject.data.id] =
                                        designStructureUpdateObject.data;
                                }

                            });

                            break;

                        case 'unload':

                            delete availableContainers[designStructureUpdateObject.data.id];
                            delete watchedContainers[designStructureUpdateObject.data.id];

                            if (angular.isObject(collector)) {
                                delete collector[designStructureUpdateObject.data.id];
                            }

                            break;

                        default:
                        case 'update':

                            if (designStructureUpdateObject.updateType === 'nameChange') {

                                if (availableContainers[designStructureUpdateObject.data.id]) {
                                    availableContainers[designStructureUpdateObject.data.id].name = designStructureUpdateObject.data.name;
                                }

                            }

                            break;

                    }
                }

            };
        };

        childContainerParser = function(collector) {
            return function(cyPhyLayout) {

                var newChildren;

                newChildren = {};

                availableContainers = availableContainers || {};

                if (angular.isObject(cyPhyLayout.elements)) {

                    angular.forEach(cyPhyLayout.elements.Container, function(container, cId) {

                        availableContainers[cId] = container;
                        newChildren[cId] = container;

                        if (angular.isObject(collector)) {
                            collector[cId] = container;
                        }

                    });
                }

                return newChildren;

            };
        };

        setupDesignInternalsWatcher = function(designId) {

            var deferred = $q.defer(),
                design;

            watchedContainers = watchedContainers || {};

            if (!watchedContainers[designId]) {

                watchedContainers[designId] = true;

                connectionHandling.establishMainGMEConnection()
                    .then(function(connectionId) {

                        designContext = designContext || {
                            db: connectionId,
                            regionId: 'Design_' + (new Date()).toISOString()
                        };

                        design = availableDesigns[designId];
                        design.childContainers = {};

                        designLayoutService.watchDiagramElements(
                            designContext,
                            designId,
                            childContainerWatcher(design.childContainers))

                        .then(function(cyPhyLayout) {
                            deferred.resolve(childContainerParser(design.childContainers)(cyPhyLayout));
                        });


                    })
                    .catch(function(reason) {
                        $rootScope.loading = false;
                        $log.debug('GME Connection could not be established', reason);
                        deferred.reject('GME Connection could not be established');
                    });
            } else {
                deferred.resolve();
            }

            return deferred.promise;

        };

        setupContainerInternalsWatcher = function(containerId) {

            var deferred = $q.defer(),
                container;

            watchedContainers = watchedContainers || {};

            connectionHandling.establishMainGMEConnection()
                .then(function(connectionId) {

                    containerLayoutContext = containerLayoutContext || {
                        db: connectionId,
                        regionId: 'Container_' + (new Date()).toISOString()
                    };

                    if (!watchedContainers[containerId]) {

                        watchedContainers[containerId] = true;

                        container = availableContainers[containerId];
                        container.childContainers = {};

                        return designLayoutService.watchDiagramElements(
                                designContext,
                                containerId,
                                childContainerWatcher(container.childContainers)
                            )
                            .then(function(cyPhyLayout) {
                                deferred.resolve(childContainerParser(container.childContainers)(cyPhyLayout));
                            });

                    } else {
                        deferred.resolve();
                    }


                })
                .catch(function(reason) {
                    $rootScope.loading = false;
                    $log.debug('GME Connection could not be established', reason);
                    deferred.reject('GME Connection could not be established');
                });


            return deferred.promise;

        };

        this.selectBranch = function(branchId) {

            var deferred;

            deferred = $q.defer();

            if (!branchId) {
                deferred.reject('No branch specified');
            } else {

                if (branchId !== selectedBranchId) {

                    $rootScope.loading = true;

                    this.leaveBranch();

                    connectionHandling.establishMainGMEConnection()
                        .then(function(connectionId) {

                            branchService.selectBranch(connectionId, branchId)
                                .then(function(branchId) {

                                    $rootScope.loading = false;

                                    selectedBranchId = branchId;

                                    setupWSWatcher().then(function() {

                                            $log.debug('Branch selected', branchId);

                                            deferred.resolve(branchId);
                                        })
                                        .catch(function(e) {
                                            deferred.reject(e);
                                        });

                                })
                                .catch(function(reason) {
                                    $rootScope.loading = false;
                                    $log.debug('Opening branch errored', branchId, reason);
                                    deferred.reject('Opening branch errored');

                                });


                        })
                        .catch(function(reason) {
                            $rootScope.loading = false;
                            $log.debug('GME Connection could not be established', reason);
                            deferred.reject('GME Connection could not be established');
                        });

                } else {
                    deferred.resolve(branchId);
                }
            }

            return deferred.promise;

        };

        this.getSelectedWorkspaceId = function() {
            return selectedWorkspaceId;
        };

        this.selectWorkspace = function(workspaceId) {

            var deferred;

            deferred = $q.defer();

            if (!workspaceId || !angular.isObject(availableWorkspaces) || !availableWorkspaces[workspaceId]) {
                deferred.reject('Non-existing worksapceId');
            } else {

                if (workspaceId !== selectedWorkspaceId) {

                    this.leaveWorkspace();

                    selectedWorkspaceId = workspaceId;

                    setupWorkspaceInternalsWatcher().then(function() {
                        $log.debug('Workspace selected', workspaceId);

                        deferred.resolve(workspaceId);

                    });

                } else {
                    deferred.resolve(workspaceId);
                }

            }

            return deferred.promise;

        };

        this.getSelectedDesignId = function() {
            return selectedDesignId;
        };

        this.getSelectedDesign = function() {

            var result;

            if (selectedDesignId && angular.isObject(availableDesigns)) {

                result = availableDesigns[selectedDesignId];
            }

            return result;
        };

        this.getSelectedDesignConfig = function() {

            var currentDesignName = this.getSelectedDesign().originalName.replace(/_/g, ' ');

            return _designConfigs[currentDesignName];

        };

        this.selectDesign = function(designId) {

            var deferred;

            deferred = $q.defer();

            if (!designId || !angular.isObject(availableDesigns) || !availableDesigns[designId]) {
                deferred.reject('Non-existing designId');
            } else {

                if (designId !== selectedDesignId) {

                    this.leaveDesign();

                    selectedDesignId = designId;

                    availableContainers = availableContainers || {};
                    availableContainers[designId] = availableDesigns[designId];

                    setupDesignInternalsWatcher(designId).then(function () {

                        $log.debug('Design selected', availableDesigns[designId]);
                        deferred.resolve(designId);

                    })
                        .catch(function (err) {
                            deferred.reject(err);
                        });

                } else {
                    deferred.resolve(designId);
                }

            }

            return deferred.promise;

        };

        this.getSelectedContainerId = function() {
            return selectedContainerId;
        };

        this.getSelectedContainer = function() {

            if (availableContainers && selectedContainerId) {
                return availableContainers[selectedContainerId];
            }

        };

        this.selectContainer = function(containerId) {

            var deferred;

            deferred = $q.defer();

            if (!containerId) {

                deferred.reject('Invalid containerId');

            } else if (!availableContainers) {

                deferred.reject('No containers available');

            } else if (containerId === selectedContainerId) {

                $log.debug('Container was already selected', availableContainers[containerId]);
                deferred.resolve(containerId);


            } else if (availableContainers[containerId]){

                self.leaveContainer();
                selectedContainerId = containerId;

                setupContainerInternalsWatcher(containerId).then(function() {

                    $log.debug('Container selected', availableContainers[containerId]);
                    deferred.resolve(containerId);

                })
                    .catch(function(err) {
                        deferred.reject(err);
                    });


            } else {

                var path = containerId.split('/');

                if (path.length > 1) {

                    path.pop();

                    self.selectContainer(path.join('/'))
                    .then(function() {

                        if (availableContainers[containerId]) {

                            self.leaveContainer();
                            selectedContainerId = containerId;

                            return setupContainerInternalsWatcher(containerId).then(function() {

                                $log.debug('Container selected', availableContainers[containerId]);
                                deferred.resolve(containerId);

                            });

                        } else {
                            deferred.reject('Could not find container through parent');
                        }

                    })
                    .catch(function(e) {
                        deferred.reject(e);
                    });


                } else {
                    deferred.reject('Could not find parent container for container to be loaded');
                }

            }

            return deferred.promise;

        };

        this.getAvailableWorkspaces = function() {
            return availableWorkspaces;
        };

        this.getAvailableDesigns = function() {
            return availableDesigns;
        };

        this.getAvailableTestbenches = function() {
            return availableTestBenches;
        };

        this.getDesignContext = function() {
            return designContext;
        };

        this.getSelectedWorkspace = function() {
            return availableWorkspaces[selectedWorkspaceId];
        };

        this.getContainerLayoutContext = function() {

            return containerLayoutContext;
        };

        this.getWorkspaceContext = function() {
            return wsContext;
        };

        this.getContainmentPathIds = function() {

            var result,

                diffStr,
                diffArray,

                parentId;

            if (selectedContainerId && selectedDesignId) {

                result = [];
                result.push(selectedDesignId);

                diffStr = selectedContainerId.replace(selectedDesignId, '');

                if (diffStr) {

                    diffArray = diffStr.split('/');

                    if (diffArray.length > 1) {

                        parentId = selectedDesignId;

                        diffArray.shift();

                        angular.forEach(diffArray, function(bit) {

                            parentId = parentId + '/' + bit;
                            result.push(parentId);

                        });
                    }

                }

            }

            return result;

        };

        this.getContainmentPath = function() {

            var ids,
                result;

            result = [];

            ids = this.getContainmentPathIds();

            angular.forEach(ids, function(id) {
                result.push(availableContainers[id]);
            });

            return result;
        };

        this.undo = function() {

            var self = this;

            connectionHandling.establishMainGMEConnection()
                .then(function(connectionId) {

                    var dbConn = dataStoreService.getDatabaseConnection(connectionId);

                    dbConn.client.undo(self.getSelectedBranchId(), function() {
                        console.log('Undo is done:', arguments);
                    });

                });

        };

    });
