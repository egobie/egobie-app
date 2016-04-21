angular.module('app.service', ['ionic', 'util.shared', 'util.url'])

    .config(function($stateProvider) {
        $stateProvider
            .state('menu.service', {
                url: '/service',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/menu/service.html'
                    }
                }
            });
    })

    .controller('serviceCtrl', function($scope, $ionicModal, shared, url) {
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

        $scope.userServices = shared.getUserServices();
        $scope.done = [];
        $scope.inProgress = [];
        $scope.reservation = [];

        for (var i = 0; i < $scope.userServices.length; i++) {
            if ($scope.userServices[i].status === "DONE") {
                $scope.done.push($scope.userServices[i]);
            } else if ($scope.userServices[i].status === "IN_PROGRESS") {
                $scope.inProgress.push($scope.userServices[i]);
            } else if ($scope.userServices[i].status === "RESERVED") {
                $scope.reservation.push($scope.userServices[i]);
            }
        }

        $scope.toggle = function(section) {
            $scope.shown[section] = !$scope.shown[section];
        };

        $scope.isShown = function(section) {
            return $scope.shown[section];
        };
    });
