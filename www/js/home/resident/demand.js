angular.module('app.home.resident.demand', ['ionic', 'app.home.resident', 'util.shared', 'util.url'])

    .controller('demandCtrl', function($scope, $state, $ionicModal, $http, $timeout, shared, url, orderService, demandOrder) {
        $scope.services = orderService.services;
        $scope.opening = {
            available: false
        };

        $scope.selectService = function() {
            $state.go('menu.home.residentService');
        };

        $ionicModal.fromTemplateUrl('templates/home/resident/demand/order.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.demandOrderModal = modal;
        });

        $scope.showDemandOrder = function() {
            for (var i in $scope.services) {
                if ($scope.services[i].checked) {
                    demandOrder.services.push($scope.services[i].id);
                }
            }

            $scope.demandOrderModal.show();
            shared.showLoading();

            $timeout(function() {
                shared.hideLoading();

                if (demandOrder.services.length === 0) {
                    shared.alert("No Services");
                    $scope.hideDemandOrder();
                } else {
                    $scope.opening.available = true;
                }
            }, 1000);
        };

        $scope.hideDemandOrder = function() {
            $scope.clear();
            $scope.demandOrderModal.hide();
        };
        
        $scope.clear = function() {
            demandOrder.clear();
            $scope.opening.available = false;
        };
    });
