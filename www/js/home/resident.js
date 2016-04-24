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

    .service('orderCar', function(shared) {
        return {
            cars: shared.getUserCars()
        };
    })

    .service('orderService', function(shared) {
        var _i = 0;
        var _temp = shared.getServices();
        var obj = {
            index: {},
            services: []
        };

        for (var _id in _temp) {
            obj.index[_id] = _i;
            obj.services.push(_temp[_id]);
            _i++;
        }

        return obj;
    })

    .service('orderPayment', function(shared) {
        return {
            payments: shared.getUserPayments()
        };
    })

    .service('previousState', function() {
        return {
            state: ""
        };
    })

    .service('futureOrder', function() {
        return {
            price: 0,
            time: 0
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

            .state('menu.home.futureOrder', {
                url: '/order',
                params: {
                    opening: {
                        day: "",
                        start: "",
                        end: ""
                    }
                },
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/order.html'
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

    .controller('futureCtrl', function($state, $scope, $http, $timeout, shared, url, getOpenings) {
        $scope.openings = getOpenings.getData();
        $scope.showIndex = -1;
        $scope.selectedRange = null;

        $scope.showOpening = function(index) {
            if (index === $scope.showIndex) {
                $scope.showIndex = -1;
            } else {
                $scope.showIndex = index;
            }
        };

        $scope.reloadOpening = function() {
            $scope.showIndex = -1;
            $scope.openings = [];
            shared.showLoading();

            $http
                .get(url.openings, {
                    headers: shared.getHeaders()
                })
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    $scope.openings = data;
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.goToOrder = function(day, start, end) {
            $timeout(function() {
                $state.go('menu.home.futureOrder', {
                    opening: {
                        day: day,
                        start: $scope.getTime(start),
                        end: $scope.getTime(end)
                    }
                });
            }, 50);
        };

        $scope.getTime = function(t) {
            if (t < 10) {
                return "0" + t + " A.M";
            } else if (t < 12) {
                return t + " A.M";
            } else {
                return t + " P.M";
            }
        };
    })

    .controller('futureOrderCtrl', function($scope, $stateParams, futureOrder) {
        $scope.order = futureOrder;
        $scope.opening = {
            day: $stateParams.opening.day,
            start: $stateParams.opening.start,
            end: $stateParams.opening.end
        };

        console.log($stateParams);
        console.log($scope.opening);

        $scope.$watch(function() {
            return $scope.order;
        }, function (newValue, oldValue) {
            $scope.order = newValue;
        });
    })

    .controller('carSelectCtrl', function($scope, $state, orderCar, previousState) {
        $scope.cars = orderCar.cars;
        $scope.selectedCar = {
            plate: ''
        };

        if (Object.keys($scope.cars).length === 1) {
            for (var _id in $scope.cars) {
                $scope.selectedCar = $scope.cars[_id];
                $scope.cars[_id].checked = true;
                break;
            }
        }

        $scope.$watch(function() {
            return $scope.selectedCar;
        }, function (newValue, oldValue) {
            $scope.selectedCar = newValue;
        });

        $scope.selectCar = function() {
            previousState.state = "menu.home.futureOrder";
            $state.go('menu.home.residentCar');
        };

        $scope.pickCar = function(selectedCar) {
            $scope.selectedCar = selectedCar;
            $state.go(previousState.state);
        };

        $scope.toggleCar = function(car) {
            for (var _id in $scope.cars) {
                $scope.cars[_id].checked = false;
            }

            car.checked = true;
        };
    })

    .controller('serviceSelectCtl', function($scope, $state, shared, orderService, futureOrder, previousState) {
        $scope.services = orderService.services;
        $scope.serviceNames = shared.getServiceNames();
        $scope.carWash = shared.getCarWashServices();
        $scope.detailing = shared.getDetailingServices();
        $scope.oilChange = shared.getOilChangeServices();

        $scope.$watch(function() {
            return orderService.services;
        }, function(newValue, oldValue) {
            $scope.services = orderService.services;
        });

        $scope.pickService = function() {
            $state.go(previousState.state);
        };

        $scope.selectService = function() {
            previousState.state = "menu.home.futureOrder";
            $state.go('menu.home.residentService');
        };

        $scope.toggleService = function(service, list) {
            for (var _i = 0; _i < list.length; _i++) {
                list[_i].checked = false;
            }

            service.checked = true;
            
            futureOrder.price = 0;
            futureOrder.time = 0;

            for (var _i = 0; _i < $scope.services.length; _i++) {
                if ($scope.services[_i].checked) {
                    futureOrder.time += $scope.services[_i].time;
                    futureOrder.price += $scope.services[_i].price;
                }
            }
        };

        $scope.unselectService = function($event, service) {
            if (service.id in orderService.index) {
                orderService.services[orderService.index[service.id]].checked = false;
            }

            futureOrder.price -= service.price;
            futureOrder.time -= service.time;

            $event.stopPropagation();
        };
    })

    .controller('paymentSelectCtrl', function($scope, $state, orderPayment, previousState) {
        $scope.payments = orderPayment.payments;
        $scope.selectedPayment = {
            account_number: ""
        };

        if (Object.keys($scope.payments).length === 1) {
            for (var _id in $scope.payments) {
                $scope.selectedPayment = $scope.payments[_id];
                $scope.payments[_id].checked = true;
                break;
            }
        }

        $scope.$watch(function() {
            return $scope.selectedPayment;
        }, function(newValue, oldValue) {
            $scope.selectedPayment = newValue;
        });

        $scope.selectPayment = function() {
            previousState.state = "menu.home.futureOrder";
            $state.go('menu.home.residentPayment');
        };

        $scope.pickPayment = function(selectedPayment) {
            $scope.selectedPayment = selectedPayment;
            $state.go(previousState.state);
        };

        $scope.togglePayment = function(payment) {
            for (var _id in $scope.payments) {
                $scope.payments[_id].checked = false;
            }

            payment.checked = true;
        };
    });
