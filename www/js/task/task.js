angular.module('app.task', ['ionic', 'util.shared', 'util.url'])

    .controller('taskCtrl', function($scope, $http, shared, url) {
        $scope.tasks = [];
        $scope.selectedTask = null;
        $scope.taskModel = null;

        $scope.showTask = function(task) {
            $scope.selectedTask = task;
            $scope.taskModel.show();
        };

        $scope.hideTask = function() {
            $scope.selectedTask = null;
            $scope.historyModel.hide();
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

        $scope.noTask = function() {
            return $scope.tasks.length === 0;
        };

        $scope.loadTasks();
    });