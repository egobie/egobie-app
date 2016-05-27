angular.module('app.notification', ['ionic', 'util.shared'])

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

    .controller('notificationCtrl', function($scope, shared) {
        shared.goNotification();

        $scope.noNotification = function() {
            return true;
        };
    });