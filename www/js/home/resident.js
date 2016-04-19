/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('app.home.resident', ['ionic', 'util.shared', 'util.url'])

    .service('getOpenings', function($http, shared, url) {
        shared.showLoading();

        var openings = null;
        var promise = $http
            .get(url.openings, {
                headers: shared.getHeaders()
            })
            .success(function(data, status, headers, config) {
                shared.hideLoading();
                openings = data;
                console.log("get data - ", openings);
            })
            .error(function(data, status, headers, config) {
                shared.hideLoading();
                shared.alert(data);
            });

        return {
            promise: promise,
            getData: function() {
                return openings;
            }
        };
    })

    .config(function($stateProvider) {

        $stateProvider

            .state('menu.home.demand', {
                url: '/resident/demand',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/demand.html'
                    }
                }
            })

            .state('menu.home.future', {
                url: '/resident/future',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/future.html'
                    }
                },
                resolve: {
                    'ResolveOpenings': function(getOpenings) {
                        return getOpenings.promise;
                    }
                }
            })

            .state('menu.home.residentCar', {
                url: '/car',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/car.html'
                    }
                }
            })

            .state('menu.home.residentService', {
                url: '/service',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/service.html'
                    }
                }
            })

            .state('menu.home.residentPayment', {
                url: '/payment',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/payment.html'
                    }
                }
            });
    })

    .factory('carService', function() {
        return {
            selectedCar: 'Y96EUV',
            cars: {
                'Y96EUV': false,
                'N93HVN': false,
                'XBBZKA': false
            }
        };
    })

    .factory('serviceService', function() {
        return {
            index: {
                'Car Wash': 0,
                'Oil Change': 1
            },
            services: [
                { service: 'Car Wash', checked: false },
                { service: 'Oil Change', checked: false }
            ]
        };
    })

    .factory('paymentService', function() {
        return {
            selectedPayment: 5690,
            payments: [
                5690,
                1340,
                8870,
                5310
            ]
        };
    })

    .controller('futureCtrl', function($scope, shared, url, getOpenings) {
        $scope.openings = getOpenings.getData();

        $scope.showOpening = function(day) {
            return false;
        };
    })

    .controller('carSelectCtrl', function($scope, $state, carService, shared) {

        console.log('carselect');
        console.log(shared.getUser());

        $scope.selectedCar = '';

        $scope.$watch(function() {
            return carService.selectedCar;
        }, function (newValue, oldValue) {
            $scope.selectedCar = newValue;
        });

        $scope.selectCar = function() {
            $state.go('menu.home.residentCar');
        };
    })

    .controller('carPickerCtrl', function($scope, $state, carService) {

        $scope.cars = carService.cars;

        if (carService.selectedCar in $scope.cars) {
            $scope.cars[carService.selectedCar] = true;
        }

        $scope.pickCar = function(selectedCar) {
            carService.selectedCar = selectedCar;
            $state.go('menu.home.demand');
        };
    })

    .controller('serviceSelectCtrl', function($scope, $state, serviceService) {

        $scope.services = serviceService.services;

        $scope.$watch(function() {
            return serviceService.services;
        }, function(newValue, oldValue) {
            $scope.services = serviceService.services;
        });

        $scope.selectService = function() {
            $state.go('menu.home.residentService');
        };

        $scope.unselectService = function($event, service) {
            if (service.service in serviceService.index) {
                serviceService.services[serviceService.index[service.service]].checked = false;
            }

            $event.stopPropagation();
        };
    })

    .controller('servicePickerCtrl', function($scope, $state, serviceService) {
        $scope.services = serviceService.services;

        $scope.pickService = function() {
            $state.go('menu.home.demand');
        };
    })

    .controller('paymentSelectCtrl', function($scope, $state, paymentService) {

        $scope.selectedPayment = '';

        $scope.$watch(function() {
            return paymentService.selectedPayment;
        }, function(newValue, oldValue) {
            $scope.selectedPayment = '**** ' + paymentService.selectedPayment;
        });

        $scope.selectPayment = function() {
            $state.go('menu.home.residentPayment');
        };
    })

    .controller('paymentPickerCtrl', function($scope, $state, paymentService) {

        $scope.payments = paymentService.payments;

        $scope.pickPayment = function(selectedPayment) {
            paymentService.selectedPayment = selectedPayment;
            $state.go('menu.home.demand');
        };
    });
