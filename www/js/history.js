/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('app.history', ['ionic', 'util.shared', 'util.url'])

    .controller('historyCtrl', function($scope, $ionicModal, $ionicPopup, $ionicActionSheet, $http, shared, url) {
        $scope.histories = {};
        $scope.reservations = [];
        $scope.max = 5;
        $scope.selectedHistory = null;
        $scope.historyModel = null;

        $ionicModal.fromTemplateUrl('history-detail', {
            scope: $scope
        }).then(function(modal) {
            $scope.historyModel = modal;
        });

        $scope.showHistory = function(id) {
            $scope.selectedHistory = shared.getUserHistory(id);
            $scope.historyModel.show();
        };

        $scope.hideHistory = function() {
            $scope.selectedHistory = null;
            $scope.historyModel.hide();
        };

        $scope.loadReservations = function() {
            $scope.reservations = [];
            shared.clearUserServices();

            shared.showLoading();
            $http
                .post(url.userServices, {
                    user_id: shared.getUser().id,
                    user_token: shared.getUser().token
                }, {
                    headers: shared.getHeaders()
                })
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.addUserServices(data);

                    if (data) {
                        Array.prototype.forEach.call(data, function(service) {
                            if (service.status === "RESERVED") {
                                $scope.reservations.push(service);
                            }
                        });
                    }
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.loadHistories = function() {
            $scope.histories = {};
            shared.clearUserHistories();

            $http
                .post(url.userHistories, {
                    user_id: shared.getUser().id,
                    page: 0
                }, {
                    headers: shared.getHeaders()
                })
                .success(function(data, status, headers, config) {
                    shared.addUserHistories(data);
                    $scope.histories = shared.getUserHistories();
                })
                .error(function(data, status, headers, config) {
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
                                .post(url.cancelOrder, {
                                    id: reservation.id,
                                    user_id: shared.getUser().id
                                }, {
                                    headers: shared.getHeaders()
                                })
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

        $scope.borderStyle = function(rating) {
            // 0.0 - 1.0
            if (rating <= 1) {
                return {
                    'egobie-history-border-bad': true
                };
            // 1.5 - 2.5
            } else if (rating < 3) {
                return {
                    'egobie-history-border-fine': true
                };
            // 3.0 - 4.0
            } else if (rating <= 4) {
                return {
                    'egobie-history-border-ok': true
                };
            } else {
                return {
                    'egobie-history-border-good': true
                };
            }
        };

        $scope.ratingStyle = function(rating) {
            // 0.0 - 1.0
            if (rating <= 1) {
                return {
                    'egobie-history-rating-bad': true
                };
            // 1.5 - 2.5
            } else if (rating < 3) {
                return {
                    'egobie-history-rating-fine': true
                };
            // 3.0 - 4.0
            } else if (rating <= 4) {
                return {
                    'egobie-history-rating-ok': true
                };
            } else {
                return {
                    'egobie-history-rating-good': true
                };
            }
        };

        $scope.historyPercent = function(value) {
            return (100 * (value / $scope.max)) + '%';
        };

        $scope.noReservation = function() {
            return $scope.reservations.length === 0;
        };

        $scope.noHistory = function() {
            return Object.keys($scope.histories).length === 0;
        };

        $scope.loadReservations();
        $scope.loadHistories();
    });
