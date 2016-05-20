/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('app.history', ['ionic', 'util.shared', 'util.url'])

    .controller('historyCtrl', function($scope, $ionicModal, $ionicPopup, $ionicActionSheet, $http, $timeout, shared, url) {
        $scope.histories = {};
        $scope.reservations = [];
        $scope.dones = [];
        $scope.max = 5;
        $scope.selectedHistory = null;
        $scope.historyModel = null;
        $scope.rating = {
            score: 0
        };

        $ionicModal.fromTemplateUrl('templates/history/rating.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.ratingModel = modal;
        });

        $scope.showRating = function() {
            $scope.ratingModel.show();
        };

        $scope.hideRating = function() {
            $scope.ratingModel.hide();

            if ($scope.selectedHistory.available) {
                $timeout(function() {
                    $scope.historyModel.show();
                }, 500);
            }
        };

        $scope.submitRating = function() {
            if ($scope.selectedHistory.rating <= 0) {
                shared.alert("Please rate our service.");
            } else {
                var request = {
                    "id": $scope.selectedHistory.id,
                    "service_id": $scope.selectedHistory.user_service_id,
                    "rating": $scope.selectedHistory.rating,
                    "note": $scope.selectedHistory.note
                };

                shared.showLoading();

                $http
                    .post(url.ratingHistory, shared.getRequestBody(request))
                    .success(function(data, status, headers, config) {
                        $scope.selectedHistory.available = true;
                        shared.hideLoading();
                        shared.refreshUserHistory($scope.selectedHistory);
                        $scope.hideRating();
                    })
                    .error(function(data, status, headers, config) {
                        shared.hideLoading();
                        shared.alert(data);
                    });
            }
        };

        $ionicModal.fromTemplateUrl('templates/history/detail.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.historyModel = modal;
        });

        $scope.showHistory = function(id) {
            $scope.selectedHistory = shared.getUserHistory(id);

            if (!$scope.selectedHistory.available) {
                // If history is not rated yet, force user to rate and open history
                // detail after closing rating page
                $scope.selectedHistory.rating = 0;
                $scope.showRating();
            } else {
                $scope.historyModel.show();
            }
        };

        $scope.hideHistory = function() {
            $scope.selectedHistory = null;
            $scope.historyModel.hide();
        };

        $scope.loadReservations = function() {
            $scope.reservations = [];
            shared.clearUserReservations();

            shared.showLoading();
            $http
                .post(url.userReservations, shared.getRequestBody({}))
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.addUserReservations(data);
                    $scope.reservations = shared.getUserReservations();
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
                .post(url.userHistories, shared.getRequestBody({
                    page: 0
                }))
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

        $scope.borderStyle = function(rating) {
            // 0.0 - 1.0
            if (rating <= 0) {
                return;
            }

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
            if (rating <= 0) {
                return;
            }

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

        $scope.historyPercent = function(value) {
            return (100 * (value / $scope.max)) + '%';
        };

        $scope.noReservation = function() {
            return !$scope.reservations || $scope.reservations.length === 0;
        };

        $scope.noHistory = function() {
            return !$scope.histories || Object.keys($scope.histories).length === 0;
        };

        $scope.getServiceType = shared.getServiceType;

        $scope.loadReservations();
        $scope.loadHistories();
    });