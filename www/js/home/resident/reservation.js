angular.module('app.home.resident.reservation', ['ionic', 'app.home.resident', 'util.shared', 'util.url'])

    .controller('reservationOrderCtrl', function($scope, order) {
        $scope.order = order;

        $scope.$watch(function() {
            return $scope.order;
        }, function (newValue, oldValue) {
            $scope.order = newValue;
        });
    })

    .controller('orderCtrl', function($scope, $state, $ionicActionSheet, $http,
            shared, url, orderOpening, orderCar, orderService, orderAddon, orderPayment, demandOrder, order) {
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
                car_id: orderCar.selected.id,
                payment_id: orderPayment.selected.id,
                note: "test",
                opening: orderOpening.id,
                services: [],
                addons: []
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

            for (var key in orderAddon.addons) {
                if (orderAddon.addons[key].checked) {
                    request.addons.push({
                        id: orderAddon.addons[key].addon.id,
                        amount: orderAddon.addons[key].addon.amount
                    });
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
                        .post(url.placeOrder, shared.getRequestBody(request))
                        .success(function(data, status, headers, config) {
                            shared.useDiscount();
                            shared.hideLoading();

                            $scope.hideReservationSheet();
                            $scope.clearReservation();

                            $state.go("menu.history");
                        })
                        .error(function(data, status, headers, config) {
                            $scope.hideReservationSheet();
                            shared.hideLoading();
                            $scope.clearReservation();
                            shared.alert(data);
                        });
                },
                cancelText: 'Cancel',
                cancel: function() {
                    
                }
            });
        };

        $scope.clearReservation = function() {
            orderOpening.clear();
            orderCar.clear();
            orderService.clear();
            orderAddon.clear();
            orderPayment.clear();
            order.clear();
            demandOrder.clear();
        };
    })

    .controller('openingCtrl', function($scope, $http, $timeout, shared, url, orderOpening, orderService, orderAddon) {
        $scope.openings = [];
        $scope.showIndex = -1;
        $scope.selectedRange = null;
        $scope.getTime = shared.getTime;

        var services = [];
        var addons = [];

        $scope.hideOpeningModal = function() {
            $scope.openingModal.hide();
        };

        for (var _i = 0; _i < orderService.services.length; _i++) {
            if (orderService.services[_i].checked) {
                services.push(orderService.services[_i].id);
            }
        }

        for (var key in orderAddon.addons) {
            if (orderAddon.addons[key].checked) {
                addons.push(orderAddon.addons[key].addon.id);
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
                .post(url.openings, shared.getRequestBody({
                    services: services,
                    addons: addons
                }))
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    $scope.openings = shared.processOpening(data);
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
                $scope.$ionicGoBack();
                //$state.go("menu.home.reservation");
                $timeout.cancel(t);
            }, 200);
        };

        $scope.isCarSelected = function(selected) {
            return {
                "egobie-plate-disabled": !selected
            };
        };

        $scope.noCar = function() {
            return Object.keys($scope.cars).length === 0;
        };
    })

    .controller('serviceSelectCtl', function($scope, $state, $ionicModal, shared, orderService, orderAddon, order, orderOpening) {
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
            $scope.$ionicGoBack();
            //$state.go("menu.home.reservation");
        };

        $scope.selectService = function() {
            $state.go('menu.home.residentService');
        };

        $scope.toggleService = function(service, list) {
            var pre = service.checked;

            for (var _i = 0; _i < list.length; _i++) {
                if (list[_i].checked) {
                    order.price -= list[_i].price;
                    order.time -= list[_i].time;

                    orderAddon.remove(list[_i].charge);
                    orderAddon.remove(list[_i].addons);
                }

                list[_i].checked = false;
            }

            service.checked = !pre;

            if (service.checked) {
                order.price += service.price;
                order.time += service.time;

                orderAddon.add(service.charge);
                orderAddon.add(service.addons);
            }
        };

        $scope.unselectService = function($event, service) {
            if (service.id in orderService.index) {
                orderService.services[orderService.index[service.id]].checked = false;

                orderAddon.remove(orderService.services[orderService.index[service.id]].charge);
                orderAddon.remove(orderService.services[orderService.index[service.id]].addons);
            }

            order.price -= service.price;
            order.time -= service.time;

            if (order.price <= 0 || order.time <= 0) {
                order.price = 0;
                order.time = 0;
                orderOpening.clear();
            }

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

    .controller('addonSelectCtl', function($scope, $state, shared, orderAddon, order) {
        $scope.addons = orderAddon.addons;

        $scope.selectAddon = function() {
            $state.go('menu.home.residentAddon');
        };

        $scope.unselectAddon = function($event, addon) {
            addon.checked = false;
            order.price -= (addon.addon.price * addon.addon.amount);
            order.time -= addon.addon.time;
            addon.addon.amount = 1;
        };

        $scope.isAddonSelected = function(checked) {
            return {
                "egobie-service-disabled": !checked
            };
        };

        $scope.toggleAddon = function(addon) {
            addon.checked = !addon.checked;

            if (addon.checked) {
                order.time += addon.addon.time;
                order.price += addon.addon.price;
            } else {
                order.time -= addon.addon.time;
                order.price -= (addon.addon.price * addon.addon.amount);
                addon.addon.amount = 1;
            }
        };

        $scope.loseFocus = function(addon) {
            if (!addon.addon.amount || addon.addon.amount < addon.addon.min) {
                addon.addon.amount = 1;
                order.price += addon.addon.price;
            }
        };

        $scope.changeAddonAmount = function(oldValue, newValue) {
            var isNanOld = isNaN(oldValue);
            var isNanNew = isNaN(newValue.addon.amount);

            if (isNanOld && isNanNew) {
                return;
            } else if (isNanOld) {
                oldValue = 1;
            } else if (isNanNew){
                newValue.addon.amount = 1;
            }

            if (newValue.addon.amount > newValue.addon.max) {
                newValue.addon.amount = newValue.addon.max;
            }

            order.price -= oldValue * newValue.addon.price;
            order.price += newValue.addon.amount * newValue.addon.price;
        };

        $scope.pickAddon = function() {
            var ids = [];

            for (var key in $scope.addons) {
                if ($scope.addons[key].checked) {
                    console.log($scope.addons[key]);
                    ids.push($scope.addons[key].addon.id);
                }
            }

            shared.demandAddons(ids);

            $scope.$ionicGoBack();
            //$state.go("menu.home.reservation");
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
                $scope.$ionicGoBack();
                //$state.go("menu.home.reservation");
                $timeout.cancel(t);
            }, 200);
        };

        $scope.isPaymentSelected = function(selected) {
            return {
                "egobie-payment-disabled": !selected
            };
        };

        $scope.noPayment = function() {
            return Object.keys($scope.payments).length === 0;
        };
    });
