angular.module('app.myservice.reservation', ['ionic', 'util.shared', 'util.url'])

    .controller('myReservationCtrl', function($scope, $ionicModal, $ionicPopup, $ionicActionSheet, $http, shared, url) {
        shared.goReservation();

        $scope.charges = {};
        $scope.order = {
            service_id: 0,
            realPrice: 0,
            price: 0,
            discount: 1.0
        };

        $ionicModal.fromTemplateUrl('templates/myservice/reservation/addservice.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.addServiceModel = modal;
        });

        $scope.showAddServiceModel = function() {
            $scope.addServiceModel.show();
        };

        $scope.hideAddServiceModel = function() {
            $scope.addServiceModel.hide();
        };

        $scope.showCancelSheet = function(reservation) {
            $scope.order.service_id = reservation.id;
            $scope.hideCancelSheet = $ionicActionSheet.show({
                titleText: 'Cancel Order',
                destructiveText: 'Cancel Reservation',
                destructiveButtonClicked: $scope.cancel,
                /**
                buttons: [
                    {text: 'Add Service'}
                ],
                **/
                buttonClicked: function(index) {
                    if (index === 0) {
                        var chargeIds = [];
                        var service = null;

                        $scope.charges = {};
                        $scope.order.service_id = reservation.id;
                        $scope.order.real_price = reservation.price;
                        $scope.order.price = 0;
                        $scope.order.discount = 1.0;

                        for (var i in reservation.addons) {
                            if (reservation.addons[i].time === 0) {
                                chargeIds.push(reservation.addons[i].id);
                            }

                            $scope.order.price += reservation.addons[i].price;
                        }

                        for (var i in reservation.services) {
                            service = shared.getService(reservation.services[i].id);

                            if (service && service.charge) {
                                for (var j in service.charge) {
                                    if (service.charge[j].max === 1 && chargeIds.indexOf(service.charge[j].id) < 0) {
                                        $scope.charges[service.charge[j].name] = service.charge[j];
                                        $scope.charges[service.charge[j].name].checked = false;
                                    }
                                }

                                $scope.order.price += service.price;
                            }
                        }

                        $scope.order.discount = ((reservation.price / $scope.order.price) < 1 ? 0.9 : 1.0);
                        $scope.showAddServiceModel();

                        return true;
                    }
                },
                cancelText: 'Close',
                cancel: function() {
                }
            });
        };

        $scope.cancel = function() {
            $ionicPopup.confirm({
                title: "Are you sure to cancel this reservation?"
            }).then(function(sure) {
                if (!sure) {
                    return;
                }

                shared.showLoading();
                $http
                    .post(url.cancelOrder, shared.getRequestBody({
                        id: $scope.order.service_id
                    }))
                    .success(function(data, status, headers, config) {
                        shared.hideLoading();

                        if (status === 200) {
                            $scope.hideCancelSheet();
                            $scope.loadReservations();
                        } else {
                            $scope.forceCancel();
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.hideCancelSheet();
                        shared.hideLoading();
                        shared.alert(data);
                    });
            });
        };

        $scope.forceCancel = function() {
            $ionicPopup.confirm({
                title: "We Will charge 50% of the appointment cost. Are you sure the cancel this reservation?"
            }).then(function(sure) {
                if (!sure) {
                    return;
                }

                shared.showLoading();
                $http
                    .post(url.forceCancelOrder, shared.getRequestBody({
                        id: $scope.order.service_id
                    }))
                    .success(function(data, status, headers, config) {
                        shared.hideLoading();
                        $scope.hideCancelSheet();
                        $scope.loadReservations();
                    })
                    .error(function(data, status, headers, config) {
                        $scope.hideCancelSheet();
                        shared.hideLoading();
                        shared.alert(data);
                    });
            });
        };

        $scope.noCharges = function() {
            return Object.keys($scope.charges).length === 0;
        };

        $scope.addExtraService = function() {
            $ionicPopup.confirm({
                title: "Are you sure to add these services (CANNOT REMOVE AFTER ADDING)?"
            }).then(function(sure) {
                if (!sure) {
                    return;
                }

                var addons = [];

                for (var name in $scope.charges) {
                    if ($scope.charges[name].checked) {
                        addons.push($scope.charges[name].id);
                    }
                }

                shared.showLoading();

                $http
                    .post(url.addService, shared.getRequestBody({
                        user_service_id: $scope.order.service_id,
                        discount: $scope.order.discount,
                        price: $scope.order.price,
                        real_price: $scope.order.real_price - 0,
                        addons: addons
                    }))
                    .success(function(data, status, headers, config) {
                        shared.hideLoading();
                        $scope.hideAddServiceModel();
                    })
                    .error(function(data, status, headers, config) {
                        shared.hideLoading();
                        shared.alert(data);
                    });
            });
        };

        $scope.isChargeSelected = function(checked) {
            return {
                "egobie-service-disabled": !checked
            };
        };

        $scope.toggleCharge = function(charge) {
            charge.checked = !charge.checked;

            if (charge.checked) {
                $scope.order.price += charge.price;
                $scope.order.real_price = ($scope.order.price * $scope.order.discount * 1.07).toFixed(2);
            } else {
                $scope.order.price -= charge.price;
                $scope.order.real_price = ($scope.order.price * $scope.order.discount * 1.07).toFixed(2);
            }
        };

        $scope.unitStyle = function(unit) {
            if (unit === "DAY") {
                return {
                    'day': true
                };
            } else if (unit === "HOUR") {
                return {
                    'hour': true
                };
            } else if (unit === "MINUTE") {
                return {
                    'min': true
                };
            }
        };

        $scope.isWill = function(reservation) {
            return reservation.how_long > 0 && reservation.status === "RESERVED";
        };

        $scope.isDelay = function(reservation) {
            return reservation.how_long < 0 && reservation.status === "RESERVED";
        };

        $scope.isInProgress = function(reservation) {
            return reservation.status === "IN_PROGRESS";
        };

        $scope.noReservation = function() {
            return !$scope.reservations || $scope.reservations.length === 0;
        };
    });