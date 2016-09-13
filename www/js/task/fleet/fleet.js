angular.module('app.task.fleet', ['ionic', 'util.shared', 'util.url'])

    .controller('taskFleetCtrl', function($scope, $http, $ionicActionSheet, $ionicModal, $ionicPopup, shared, url) {
        $scope.fleetModel = null;
        $scope.details = [];

        $ionicModal.fromTemplateUrl("templates/task/fleet/detail.html", {
            scope: $scope
        }).then(function(modal) {
            $scope.fleetModel = modal;
        });

        $scope.fleetTaskFilter = function(task) {
            return task.isToday === shared.showTodayTask();
        };

        $scope.showOrderDetail = function(id) {
            $scope.fleetModel.show();
            $scope.loadDetails(id);
        };

        $scope.hideOrderDetail = function() {
            $scope.fleetModel.hide();
            $scope.details = [];
        };

        $scope.showFleetTaskSheet = function(task) {
            if (task.isToday && task.status === "RESERVED") {
                $scope.hideFleetTaskSheet = $ionicActionSheet.show({
                    titleText: 'Start Task (CANNOT MAKE THIS TASK "RESERVED" AGAIN)',
                    buttons: [
                        { text: 'View' }
                    ],
                    buttonClicked: function(index) {
                        if (index === 0) {
                            $scope.showOrderDetail(task.id);
                        }

                        return true;
                    },
                    destructiveText: "Start",
                    destructiveButtonClicked: function() {
                        $ionicPopup.confirm({
                            title: "Start this task?"
                        }).then(function(sure) {
                            if (sure) {
                                shared.showLoading();
                                $http
                                    .post(url.startFleetTask, shared.getRequestBody({
                                        service_id: task.id
                                    }))
                                    .success(function(data, status, headers, config) {
                                        shared.hideLoading();

                                        $scope.hideFleetTaskSheet();
                                        $scope.loadTasks(true);
                                    })
                                    .error(function(data, status, headers, config) {
                                        $scope.hideFleetTaskSheet();
                                        shared.hideLoading();
                                        shared.alert(data);
                                    });
                            }
                        });
                    },
                    cancelText: 'Close',
                    cancel: function() {

                    }
                });
            } else if (task.isToday && task.status === "IN_PROGRESS") {
                $scope.hideFleetTaskSheet = $ionicActionSheet.show({
                    titleText: 'Finish Task CANNOT MAKE THIS TASK "RESERVED" OR "IN_PROGRESS" AGAIN',
                    buttons: [
                        { text: 'View' }
                    ],
                    buttonClicked: function(index) {
                        if (index === 0) {
                            $scope.showOrderDetail(task.id);
                        }

                        return true;
                    },
                    destructiveText: "DONE",
                    destructiveButtonClicked: function() {
                        $ionicPopup.confirm({
                            title: "Finish this task?"
                        }).then(function(sure) {
                            if (sure) {
                                shared.showLoading();
                                $http
                                    .post(url.finishFleetTask, shared.getRequestBody({
                                        service_id: task.id
                                    }))
                                    .success(function(data, status, headers, config) {
                                        shared.hideLoading();
                                        $scope.hideFleetTaskSheet();
                                        $scope.loadTasks(true);
                                    })
                                    .error(function(data, status, headers, config) {
                                        $scope.hideFleetTaskSheet();
                                        shared.hideLoading();
                                        shared.alert(data);
                                    });
                            }
                        });

                        return false;
                    },
                    cancelText: 'Close',
                    cancel: function() {

                    }
                });
            } else  {
                $scope.hideFleetTaskSheet = $ionicActionSheet.show({
                    titleText: 'View Task',
                    buttons: [
                        { text: 'View' }
                    ],
                    buttonClicked: function(index) {
                        if (index === 0) {
                            $scope.showOrderDetail(task.id);
                        }

                        return true;
                    },
                    cancelText: 'Close',
                    cancel: function() {

                    }
                });
            }
        };

        $scope.loadDetails = function(id) {
            shared.showLoading();

            $http
                .post(url.details, shared.getRequestBody({
                    fleet_service_id: id
                }))
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    $scope.details = data;
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.noFleetTask = function() {
            if (!$scope.fleetTasks || $scope.fleetTasks.length === 0) {
                return true;
            }

            for (var i in $scope.fleetTasks) {
                if ($scope.fleetTasks[i].isToday === shared.showTodayTask()) {
                    return false;
                }
            }

            return true;
        };
    });