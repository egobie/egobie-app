angular.module('app.myservice', ['ionic', 'util.shared', 'util.url'])

    .config(function($stateProvider) {
        $stateProvider

            .state('menu.myservice', {
                url: '/myservice',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/myservice/myservice.html'
                    }
                }
            })

            .state('menu.myservice.reservation', {
                url: '/reservation',
                views: {
                    'reservation-view': {
                        templateUrl: 'templates/myservice/reservation/reservation.html'
                    }
                }
            })

            .state('menu.myservice.history', {
                url: '/history',
                views: {
                    'history-view': {
                        templateUrl: 'templates/myservice/history/history.html'
                    }
                }
            });
    })

    .controller('myServiceCtrl', function($scope, $interval, $http, shared, url) {
        $scope.badge = {
            history: shared.getUnratedHistory()
        };

        $scope.intervals = {
            history: null,
            reservation: null
        };

        $scope.reservations = [];
        $scope.histories = {};

        $scope.$watch(function() {
            return shared.getUnratedHistory();
        }, function(newValue) {
            $scope.badge.history = newValue;
        });

        $scope.$on('$destroy', function(event) {
            for (var interval in $scope.intervals) {
                if ($scope.intervals[interval]) {
                    $interval.cancel($scope.intervals[interval]);
                }
            }
        });

        $scope.loadHistories = function(animation) {
            if ($scope.intervals.history) {
                $interval.cancel($scope.intervals.history);
            }

            $scope.intervals.history = $interval(function() {
                $scope.loadHistories(false);
            }, 60000);

            if (animation) {
                shared.showLoading();
            }

            $http
                .post(url.userHistories, shared.getRequestBody({
                    page: 0
                }))
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.unratedHistory = 0;

                    if (data) {
                        Array.prototype.forEach.call(data, function(history) {
                            history.available = history.rating > 0;

                            if (!history.available) {
                                shared.unratedHistory++;
                            }
                        });
                    }

                    $scope.histories = data;
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.loadReservations = function(animation) {
            if ($scope.intervals.reservation) {
                $interval.cancel($scope.intervals.reservation);
            }

            $scope.intervals.reservation = $interval(function() {
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

        $scope.loadReservations(true);
        $scope.loadHistories(false);
    });