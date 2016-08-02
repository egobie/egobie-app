angular.module('app.task', ['ionic', 'util.shared', 'util.url'])

    .config(function($stateProvider) {
        $stateProvider
            .state('menu.task', {
                url: '/task',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/task/task.html'
                    }
                }
            })

            .state('menu.task.residential', {
                url: '/task/residential',
                views: {
                    'residential-task-view': {
                        templateUrl: 'templates/task/residential/residential.html'
                    }
                }
            })

            .state('menu.task.fleet', {
                url: '/task/fleet',
                views: {
                    'fleet-task-view': {
                        templateUrl: 'templates/task/fleet/fleet.html'
                    }
                }
            })

            .state('menu.upcoming', {
                url: '/upcoming',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/task/upcoming.html'
                    }
                }
            })

            .state('menu.upcoming.residential', {
                url: '/upcoming/residential',
                views: {
                    'residential-task-view': {
                        templateUrl: 'templates/task/residential/residential.html'
                    }
                }
            })

            .state('menu.upcoming.fleet', {
                url: '/upcoming/fleet',
                views: {
                    'fleet-task-view': {
                        templateUrl: 'templates/task/fleet/fleet.html'
                    }
                }
            });
    })

    .controller('taskCtrl', function($scope, shared) {
        $scope.userTasks = shared.getUserTasks();
        $scope.fleetTasks = shared.getFleetTasks();
        $scope.getServiceType = shared.getServiceType;

        console.log(shared.showTodayTask());

        $scope.$watch(function() {
            return shared.getUserTasks();
        }, function(newValue) {
            $scope.userTasks = shared.getUserTasks();
        });

        $scope.$watch(function() {
            return shared.getFleetTasks();
        }, function(newValue) {
            $scope.fleetTasks = shared.getFleetTasks();
        });

        $scope.loadTasks = function(animation) {
            shared.loadTasks(animation);
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
    });