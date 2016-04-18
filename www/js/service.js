angular.module('app.service', ['ionic', 'util.shared', 'util.url'])

    .controller('serviceCtrl', function($scope, $ionicModal, $http, shared, url) {

        $ionicModal.fromTemplateUrl('service-detail', {
            scope: $scope
        }).then(function(modal) {
            $scope.showDetailModel = modal;
        });

        $scope.showDetail = function() {
            $scope.showDetailModel.show();
        };

        $scope.hideDetail = function() {
            $scope.showDetailModel.hide();
        };

        $scope.shown = {
            "DONE": true,
            "IN_PROGRESS": true,
            "RESERVED": true
        };

        $scope.done = [];
        $scope.inProgress = [];
        $scope.reservation = [];
        $scope.userServices = shared.getUserServices($scope);

        $scope.toggle = function(section) {
            $scope.shown[section] = !$scope.shown[section];
        };

        $scope.isShown = function(section) {
            return $scope.shown[section];
        };
    });;
