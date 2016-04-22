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
            $scope.serviceModel = modal;
        });

        $scope.serviceShown = {
            "CAR_WASH": true,
            "OIL_CHANGE": true,
            "DETAILING": true
        };

        $scope.serviceNames = {
            "CAR_WASH": "Car Wash",
            "OIL_CHANGE": "Oil Change",
            "DETAILING": "Detailing"
        };

        $scope.services = shared.getServices();
        $scope.selectedService = null;
        $scope.carWash = [];
        $scope.oilChange = [];
        $scope.detailing = [];

        for (var i in $scope.services) {
            if ($scope.services[i].type === "CAR_WASH") {
                $scope.carWash.push($scope.services[i]);
            } else if ($scope.services[i].type === "OIL_CHANGE") {
                $scope.oilChange.push($scope.services[i]);
            } else if ($scope.services[i].type === "DETAILING") {
                $scope.detailing.push($scope.services[i]);
            }
        }

        $scope.showService = function(service) {
            $scope.selectedService = service;
            $scope.serviceModel.show();
        };

        $scope.hideService = function() {
            $scope.selectedService = null;
            $scope.serviceModel.hide();
        };

        $scope.isShownService = function(name) {
            return $scope.serviceShown[name];
        };

        $scope.toggleShownService = function(name) {
            $scope.serviceShown[name] = !$scope.serviceShown[name];
        };
    });
