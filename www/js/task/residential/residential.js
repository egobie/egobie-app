angular.module('app.task.residential', ['ionic', 'util.shared', 'util.url'])

    .controller('taskResidentialCtrl', function($scope, $http, $ionicActionSheet, $ionicPopup, shared, url) {
        $scope.showUserTaskSheet = function(task) {
            if (task.status === "RESERVED") {
                $scope.hideUserTaskSheet = $ionicActionSheet.show({
                    titleText: 'Start Task (CANNOT MAKE THIS TASK "RESERVED" AGAIN)',
                    destructiveText: "Start",
                    destructiveButtonClicked: function() {
                        $ionicPopup.confirm({
                            title: "Start this task?"
                        }).then(function(sure) {
                            if (sure) {
                                shared.showLoading();
                                $http
                                    .post(url.startUserTask, shared.getRequestBody({
                                        service_id: task.id
                                    }))
                                    .success(function(data, status, headers, config) {
                                        shared.hideLoading();

                                        $scope.hideUserTaskSheet();
                                        $scope.loadTasks(true);
                                    })
                                    .error(function(data, status, headers, config) {
                                        $scope.hideUserTaskSheet();
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
            } else if (task.status === "IN_PROGRESS") {
                $scope.hideStatusSheet = $ionicActionSheet.show({
                    titleText: 'Finish Task CANNOT MAKE THIS TASK "RESERVED" OR "IN_PROGRESS" AGAIN',
                    destructiveText: "DONE",
                    destructiveButtonClicked: function() {
                        $ionicPopup.confirm({
                            title: "Finish this task?"
                        }).then(function(sure) {
                            if (sure) {
                                shared.showLoading();
                                $http
                                    .post(url.finishUserTask, shared.getRequestBody({
                                        service_id: task.id
                                    }))
                                    .success(function(data, status, headers, config) {
                                        shared.hideLoading();
                                        $scope.hideUserTaskSheet();
                                        $scope.loadTasks(true);
                                    })
                                    .error(function(data, status, headers, config) {
                                        $scope.hideUserTaskSheet();
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
            }
        };

        $scope.noUserTask = function() {
            return !$scope.tasks || $scope.tasks.length === 0;
        };
    });