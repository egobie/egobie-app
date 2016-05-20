angular.module('app.notification', ['ionic'])

    .controller('notificationCtrl', function($scope) {
        $scope.noNotification = function() {
            return true;
        };
    });