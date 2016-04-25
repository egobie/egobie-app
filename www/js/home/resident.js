/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('app.home.resident', ['ionic', 'util.shared', 'util.url'])

    .service('orderCar', function(shared) {
        return {
            selected: {
                id: -1,
                plate: ''
            },
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
            selected: {
                id: -1,
                plate: ''
            },
            payments: shared.getUserPayments()
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
                }
//                resolve: {
//                    'ResolveOpenings': function(getOpenings) {
//                        return getOpenings.promise;
//                    }
//                }
            })

            .state('menu.home.futureOrder', {
                url: '/order',
                params: {
                    opening: {
                        id: -1,
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

    .controller('futureCtrl', function($state, $scope, $http, $timeout, shared, url) {
        $scope.openings = [];
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

            $timeout(function() {
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
            }, 1000);
        };

        $scope.goToOrder = function(id, day, start, end) {
            $timeout(function() {
                $state.go('menu.home.futureOrder', {
                    opening: {
                        id: id,
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

        $scope.reloadOpening();
    })

    .controller('futureOrderCtrl', function($scope, $state, $stateParams, $ionicActionSheet, $http,
            shared, url, orderCar, orderService, orderPayment, futureOrder) {
        $scope.order = futureOrder;
        $scope.opening = {
            id: $stateParams.opening.id,
            day: $stateParams.opening.day,
            start: $stateParams.opening.start,
            end: $stateParams.opening.end
        };

        $scope.$watch(function() {
            return $scope.order;
        }, function (newValue, oldValue) {
            $scope.order = newValue;
        });

        $scope.validateRequest = function(request) {
            if (request.car_id <= 0) {
                shared.alert("Please choose a vehicle");
                return false;
            }

            if (request.payment_id <= 0) {
                shared.alert("Please choose a payment method");
                return false;
            }

            if (request.opening <= 0) {
                shared.alert("Please choose a date");
                return false;
            }

            if (!request.services.length) {
                shared.alert("Please choose at least one service");
                return false;
            }

            return true;
        };

        $scope.placeOrderSheet = function() {
            var request = {
                user_id: shared.getUser().id,
                car_id: orderCar.selected.id,
                payment_id: orderPayment.selected.id,
                note: "test",
                opening: $scope.opening.id,
                services: []
            };

            for (var _i = 0; _i < orderService.services.length; _i++) {
                if (orderService.services[_i].checked) {
                    request.services.push(orderService.services[_i].id);
                }
            }

            if (!$scope.validateRequest(request)) {
                return;
            }

            $scope.hideReservationSheet = $ionicActionSheet.show({
                titleText: 'Make a Reservation',
                destructiveText: 'Place Order',
                destructiveButtonClicked: function() {
                    shared.showLoading();
                    $http
                        .post(url.placeOrder, request, {
                            headers: shared.getHeaders()
                        })
                        .success(function(data, status, headers, config) {
                            shared.hideLoading();
                            $scope.hideReservationSheet();
                            $state.go("menu.history");
                        })
                        .error(function(data, status, headers, config) {
                            
                        });
                    $scope.hideReservationSheet();
                },
                cancelText: 'Cancel',
                cancel: function() {
                    console.log('Cancel');
                }
            });
        };
    })

    .controller('carSelectCtrl', function($scope, $state, $timeout, $ionicModal, orderCar) {
        $scope.cars = orderCar.cars;
        $scope.selectedCar = orderCar.selected;

        $scope.$watch(function() {
            return orderCar.selected;
        }, function (newValue, oldValue) {
            $scope.selectedCar = newValue;
        });

        $ionicModal.fromTemplateUrl('templates/car/add.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.addCarModal = modal;
        });

        $scope.showAddCar = function() {
            $scope.addCarModal.show();
        };

        $scope.selectCar = function() {
            $state.go('menu.home.residentCar');
        };

        $scope.pickCar = function(car) {
            for (var _id in $scope.cars) {
                $scope.cars[_id].checked = false;
            }

            car.checked = true;
            orderCar.selected = car;

            $timeout(function() {
                $state.go("menu.home.futureOrder");
            }, 100);
        };
    })

    .controller('serviceSelectCtl', function($scope, $state, shared, orderService, futureOrder) {
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
            $state.go("menu.home.futureOrder");
        };

        $scope.selectService = function() {
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

    .controller('paymentSelectCtrl', function($scope, $state, $timeout, $ionicModal, orderPayment) {
        $scope.payments = orderPayment.payments;
        $scope.selectedPayment = orderPayment.selected;

        $scope.$watch(function() {
            return orderPayment.selected;
        }, function (newValue, oldValue) {
            $scope.selectedPayment = newValue;
        });

        $ionicModal.fromTemplateUrl('templates/payment/add.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.addPaymentModal = modal;
        });

        $scope.showAddPayment = function() {
            $scope.addPaymentModal.show();
        };

        $scope.selectPayment = function() {
            $state.go('menu.home.residentPayment');
        };

        $scope.pickPayment = function(selectedPayment) {
            for (var _id in $scope.payments) {
                $scope.payments[_id].checked = false;
            }

            selectedPayment.checked = true;
            orderPayment.selected = selectedPayment;

            $timeout(function() {
                $state.go("menu.home.futureOrder");
            }, 100);
        };
    });
