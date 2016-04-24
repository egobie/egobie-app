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

        $scope.services = shared.getServices();
        $scope.carWash = shared.getCarWashServices();
        $scope.oilChange = shared.getOilChangeServices();
        $scope.detailing = shared.getDetailingServices();
        $scope.serviceNames = shared.getServiceNames();
        $scope.selectedService = null;

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
