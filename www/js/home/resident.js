angular.module('app.home.resident', ['ionic', 'util.shared', 'util.url'])

    .service('orderOpening', function() {
        return {
            id: -1,
            day: "",
            start: "",
            end: ""
        };
    })

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

    .service('order', function() {
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

            .state('menu.home.reservation', {
                url: '/resident/reservation',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/order.html'
                    }
                }
            })

            .state('menu.home.residentCar', {
                url: '/resident/reservation/car',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/car.html'
                    }
                }
            })

            .state('menu.home.residentService', {
                url: '/resident/reservation/service',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/service.html'
                    }
                }
            })

            .state('menu.home.residentPayment', {
                url: '/resident/reservation/payment',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/payment.html'
                    }
                }
            });
    })

    .controller('navigationCtrl', function($scope, $state) {
        $scope.gotoOnDemand = function() {
            $state.go("menu.home.demand");
        };

        $scope.gotoReservation = function() {
            $state.go("menu.home.reservation");
        };
    })

    .controller('reservationOrderCtrl', function($scope, $state, $timeout, $ionicActionSheet, $http,
            shared, url, orderOpening, orderCar, orderService, orderPayment, order) {
        $scope.order = order;

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
            $state.go("menu.history");
            return;

            var request = {
                user_id: shared.getUser().id,
                car_id: orderCar.selected.id,
                payment_id: orderPayment.selected.id,
                note: "test",
                opening: orderOpening.id,
                services: []
            };

            if (!(shared.getUser().home_street || "")) {
                shared.alert("Please provide address");
                return;
            }

            for (var _i = 0; _i < orderService.services.length; _i++) {
                if (orderService.services[_i].checked) {
                    request.services.push(orderService.services[_i].id);
                }
            }

            if (!$scope.validateRequest(request)) {
                return;
            }

            $scope.hideReservationSheet = $ionicActionSheet.show({
                titleText: 'We process payment only after the service is done',
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

                            var t = $timeout(function() {
                                $state.go("menu.history");
                                $timeout.cancel(t);
                            }, 200);
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

    .controller('openingCtrl', function($scope, $http, $timeout, shared, url, orderOpening, orderService) {
        $scope.openings = [];
        $scope.showIndex = -1;
        $scope.selectedRange = null;

        var services = [];

        $scope.hideOpeningModal = function() {
            $scope.openingModal.hide();
            $scope.openingModal.remove();
        };

        for (var _i = 0; _i < orderService.services.length; _i++) {
            if (orderService.services[_i].checked) {
                services.push(orderService.services[_i].id);
            }
        }

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
                .post(url.openings, services, {
                    headers: shared.getHeaders()
                })
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    $scope.openings = data;
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                    $scope.hideOpeningModal();
                });
        };

        $scope.goToOrder = function(id, day, start, end) {
            shared.demandOpening(id);

            orderOpening.id = id;
            orderOpening.day = day;
            orderOpening.start = $scope.getTime(start);
            orderOpening.end = $scope.getTime(end);

            var t = $timeout(function() {
                $scope.hideOpeningModal();
                $timeout.cancel(t);
            }, 200);
        };

        $scope.getTime = function(t) {
            var sufix = "";

            if (t % 1 === 0) {
                sufix = ":00";
            } else {
                t -= 0.5;
                sufix = ":30";
            }

            if (t < 10) {
                return "0" + t + sufix + " A.M";
            } else if (t < 12) {
                return t + sufix + " A.M";
            } else {
                return t + sufix + " P.M";
            }
        };

        $scope.reloadOpening();
    })

    .controller('openingSelectCtl', function($scope, $ionicModal, orderOpening) {
        $scope.opening = {
            day: orderOpening.day,
            start: orderOpening.start,
            end: orderOpening.end
        };

        $scope.$watch(function() {
            return orderOpening.id;
        }, function(newValue, oldValue) {
            $scope.opening.day = orderOpening.day;
            $scope.opening.start = orderOpening.start;
            $scope.opening.end = orderOpening.end;
        });

        $scope.showOpeningModal = function() {
            $ionicModal.fromTemplateUrl("templates/home/resident/opening.html", {
                scope: $scope
            }).then(function(modal) {
                $scope.openingModal = modal;
                $scope.openingModal.show();
            });
        };
    })

    .controller('addressSelectCtrl', function($scope, $ionicModal, shared) {
        $scope.address = shared.getUser().home_street || "";

        $scope.$watch(function() {
            return shared.getUser().home_street;
        }, function (newValue, oldValue) {
            $scope.address = shared.getUser().home_street;
        });

        $scope.showEditHome = function() {
            $ionicModal.fromTemplateUrl("templates/setting/home.html", {
                scope: $scope
            }).then(function(modal) {
                $scope.editHomeModal = modal;
                $scope.editHomeModal.show();
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

            var t = $timeout(function() {
                $state.go("menu.home.reservation");
                $timeout.cancel(t);
            }, 200);
        };

        $scope.isCarSelected = function(selected) {
            return {
                "egobie-plate-disabled": !selected
            };
        };
    })

    .controller('serviceSelectCtl', function($scope, $state, $ionicModal, shared, orderService, order) {
        $scope.services = orderService.services;
        $scope.serviceNames = shared.getServiceNames();
        $scope.carWash = shared.getCarWashServices();
        $scope.detailing = shared.getDetailingServices();
        $scope.oilChange = shared.getOilChangeServices();
        $scope.selectedService = null;

        $scope.$watch(function() {
            return orderService.services;
        }, function(newValue, oldValue) {
            $scope.services = orderService.services;
        });

        $scope.pickService = function() {
            var ids = [];

            for (var _i = 0; _i < $scope.services.length; _i++) {
                if ($scope.services[_i].checked) {
                    ids.push($scope.services[_i].id);
                }
            }

            shared.demandService(ids);
            $state.go("menu.home.reservation");
        };

        $scope.selectService = function() {
            $state.go('menu.home.residentService');
        };

        $scope.toggleService = function(service, list) {
            for (var _i = 0; _i < list.length; _i++) {
                list[_i].checked = false;
            }

            service.checked = true;
            order.price = 0;
            order.time = 0;

            for (var _i = 0; _i < $scope.services.length; _i++) {
                if ($scope.services[_i].checked) {
                    order.time += $scope.services[_i].time;
                    order.price += $scope.services[_i].price;
                }
            }
        };

        $scope.unselectService = function($event, service) {
            if (service.id in orderService.index) {
                orderService.services[orderService.index[service.id]].checked = false;
            }

            order.price -= service.price;
            order.time -= service.time;

            $event.stopPropagation();
        };

        $ionicModal.fromTemplateUrl('templates/service/detail.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.serviceModel = modal;
        });

        $scope.showService = function(service) {
            shared.readService(service.id);
            $scope.selectedService = service;
            $scope.serviceModel.show();
        };

        $scope.isServiceSelected = function(checked) {
            return {
                "egobie-service-disabled": !checked
            };
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

            var t = $timeout(function() {
                $state.go("menu.home.reservation");
                $timeout.cancel(t);
            }, 200);
        };

        $scope.isPaymentSelected = function(selected) {
            return {
                "egobie-payment-disabled": !selected
            };
        };
    });
