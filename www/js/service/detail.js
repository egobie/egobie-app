angular.module('app.service.detail', ['ionic'])

    .controller('serviceDetailCtrl', function($scope) {
        $scope.hideService = function() {
            $scope.serviceModel.hide();
            $scope.serviceModel.remove();
        };
    });