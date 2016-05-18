angular.module('app.task', ['ionic', 'util.shared', 'util.url'])

    .controller('taskCtrl', function($scope, $http, $ionicActionSheet, $ionicPopup, shared, url) {
        $scope.tasks = [];
        $scope.selectedTask = null;
        $scope.taskModel = null;

        $scope.showStatusSheet = function(task) {
            $scope.hideStatusSheet = $ionicActionSheet.show({
                titleText: 'Change Status',
                buttons: [
                    {text: "Start"},
                    {text: "Done"}
                ],
                buttonClicked: function(index) {
                    if (index === 0) {
                        // Start
                        $ionicPopup.confirm({
                            title: "Start this task?"
                        }).then(function(sure) {
                            if (sure) {
                                shared.showLoading();
                                $http
                                    .post(url.startTask, shared.getRequestBody({
                                        service_id: task.id
                                    }))
                                    .success(function(data, status, headers, config) {
                                        shared.hideLoading();

                                        $scope.hideStatusSheet();
                                        $scope.loadTasks();
                                    })
                                    .error(function(data, status, headers, config) {
                                        $scope.hideStatusSheet();
                                        shared.hideLoading();
                                        shared.alert(data);
                                    });
                            }
                        });
                    } else if (index === 1) {
                        // Done
                        $ionicPopup.confirm({
                            title: "Finish this task?"
                        }).then(function(sure) {
                            if (sure) {
                                shared.showLoading();
                                $http
                                    .post(url.finishTask, shared.getRequestBody({
                                        service_id: task.id
                                    }))
                                    .success(function(data, status, headers, config) {
                                        shared.hideLoading();
                                        $scope.hideStatusSheet();
                                        $scope.loadTasks();
                                    })
                                    .error(function(data, status, headers, config) {
                                        $scope.hideStatusSheet();
                                        shared.hideLoading();
                                        shared.alert(data);
                                    });
                            }
                        });
                    }

                    return false;
                },
                cancelText: 'Close',
                cancel: function() {
                    
                }
            });
        };

        $scope.loadTasks = function() {
            $scope.tasks = [];

            shared.showLoading();
            $http
                .post(url.tasks, shared.getRequestBody({}))
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    $scope.tasks = data;
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.taskBorderStyle = function(status) {
            if (status === "RESERVED") {
                return {
                    'egobie-task-border-reserved': true
                };
            } else if (status === "IN_PROGRESS") {
                return {
                    'egobie-task-border-progress': true
                };
            } else if (status === "DONE") {
                return {
                    'egobie-task-border-done': true
                };
            }
        };

        $scope.noTask = function() {
            return !$scope.tasks.length || $scope.tasks.length === 0;
        };

        $scope.getServiceType = shared.getServiceType;

        $scope.loadTasks();
    });