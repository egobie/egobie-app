angular.module('app.home.resident.demand', ['ionic', 'app.home.resident', 'util.shared', 'util.url'])

    .controller('demandCtrl', function($scope, $state, $ionicModal, $http, $timeout, shared, url,
            orderService, orderCar, orderPayment, demandOrder) {
        $scope.services = orderService.services;

        $scope.selectService = function() {
            $state.go('menu.home.residentService');
        };

        $scope.unselectService = function($event, service) {
            if (service.id in orderService.index) {
                orderService.services[orderService.index[service.id]].checked = false;
            }
        };

        $scope.gotoDemandOrder = function() {
            for (var i in $scope.services) {
                if ($scope.services[i].checked) {
                    demandOrder.services.push($scope.services[i].id);
                }
            }

            shared.showLoading();

            $timeout(function() {
                if (demandOrder.services.length === 0) {
                    shared.hideLoading();
                    shared.alert("No Available");
                } else {
                    $state.go("menu.home.demandOrder");
                }
            }, 1000);
        };

        $scope.goHome = function() {
            demandOrder.clear();
            orderService.clear();
            orderCar.clear();
            orderPayment.clear();
            $scope.opening.available = false;
        };
    });
