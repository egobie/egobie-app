angular.module('app.history.reservation', ['ionic', 'util.shared', 'util.url'])

    .controller('myReservationCtrl', function($scope, $ionicPopup, $ionicActionSheet, $http, $interval, shared, url) {
        $scope.reservations = [];
        $scope.interval = null;

        $scope.loadReservations = function(animation) {
            if ($scope.interval) {
                $interval.cancel($scope.interval);
            }

            $scope.interval = $interval(function() {
                $scope.loadReservations(false);
            }, 60000);

            if (animation) {
                shared.showLoading();
            }

            $http
                .post(url.userReservations, shared.getRequestBody({}))
                .success(function(data, status, headers, config) {
                    shared.hideLoading();

                    if (data) {
                        Array.prototype.forEach.call(data, function(reservation) {
                            if (reservation.services) {
                                Array.prototype.forEach.call(reservation.services, function(service) {
                                    service.full_type = shared.getServiceType(service.type);
                                });
                            }                      
                        });
                    }

                    $scope.reservations = data;
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.showCancelSheet = function(reservation) {
            $scope.hideCancelSheet = $ionicActionSheet.show({
                titleText: 'Cancel Order',
                destructiveText: 'Cancel Reservation',
                destructiveButtonClicked: function() {
                    $ionicPopup.confirm({
                        title: "Are you sure to cancel this reservation?"
                    }).then(function(sure) {
                        if (sure) {
                            shared.showLoading();
                            $http
                                .post(url.cancelOrder, shared.getRequestBody({
                                    id: reservation.id
                                }))
                                .success(function(data, status, headers, config) {
                                    shared.unlockUserCar(reservation.car_id);
                                    shared.unlockUserPayment(reservation.payment_id);
                                    shared.hideLoading();

                                    $scope.hideCancelSheet();
                                    $scope.loadReservations();
                                })
                                .error(function(data, status, headers, config) {
                                    $scope.hideCancelSheet();
                                    shared.hideLoading();
                                    shared.alert(data);
                                });
                        }
                    });
                },
                cancelText: 'Close',
                cancel: function() {
                    
                }
            });
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

        $scope.loadReservations(true);
    });