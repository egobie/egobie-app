angular.module('app.myservice.history', ['ionic', 'util.shared', 'util.url'])

    .controller('myHistoryCtrl', function($scope, $ionicModal, $http, $timeout, $interval, shared, url) {
        shared.goHistory();

        $scope.histories = {};
        $scope.max = 5;
        $scope.selectedHistory = null;
        $scope.historyModel = null;
        $scope.interval = null;
        $scope.rating = {
            score: 0
        };

        $scope.$on('$destroy', function(event) {
            if ($scope.interval) {
                $interval.cancel($scope.interval);
            }
        });

        $ionicModal.fromTemplateUrl('templates/myservice/history/rating.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.ratingModel = modal;
        });

        $scope.showRating = function() {
            shared.openRating();
            $scope.ratingModel.show();
        };

        $scope.hideRating = function() {
            $scope.ratingModel.hide();

            if ($scope.selectedHistory.available) {
                $timeout(function() {
                    shared.readHistory();
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
                        shared.hideLoading();

                        $scope.selectedHistory.available = true;
                        $scope.hideRating();
                    })
                    .error(function(data, status, headers, config) {
                        shared.hideLoading();
                        shared.alert(data);
                    });
            }
        };

        $ionicModal.fromTemplateUrl('templates/myservice/history/detail.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.historyModel = modal;
        });

        $scope.showHistory = function(history) {
            $scope.selectedHistory = history;

            if (!$scope.selectedHistory.available) {
                // If history is not rated yet, force user to rate and open history
                // detail after closing rating page
                $scope.selectedHistory.rating = 0;
                $scope.showRating();
            } else {
                shared.readHistory();
                $scope.historyModel.show();
            }
        };

        $scope.hideHistory = function() {
            $scope.selectedHistory = null;
            $scope.historyModel.hide();
        };

        $scope.loadHistories = function() {
            if ($scope.interval) {
                $interval.cancel($scope.interval);
            }

            $scope.interval = $interval(function() {
                $scope.loadHistories(false);
            }, 60000);

            $http
                .post(url.userHistories, shared.getRequestBody({
                    page: 0
                }))
                .success(function(data, status, headers, config) {
                    if (data) {
                        Array.prototype.forEach.call(data, function(history) {
                            history.available = history.rating > 0;
                        });
                    }

                    $scope.histories = data;
                })
                .error(function(data, status, headers, config) {
                    shared.alert(data);
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

        $scope.historyPercent = function(value) {
            return (100 * (value / $scope.max)) + '%';
        };

        $scope.noHistory = function() {
            return !$scope.histories || Object.keys($scope.histories).length === 0;
        };

        $scope.getServiceType = shared.getServiceType;

        $scope.loadHistories();
    });