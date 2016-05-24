angular.module('app.notification', ['ionic'])

    .config(function($stateProvider) {
        $stateProvider
            .state('menu.notification', {
                url: '/notification',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/notification/notification.html'
                    }
                }
            });
    })

    .controller('notificationCtrl', function($scope) {
        $scope.noNotification = function() {
            return true;
        };
    });