angular.module('app.service', ['ionic', 'util.shared', 'util.url'])

    .service('getUserServices', function($http, shared, url) {
        shared.showLoading();

        var userServices = null;
        var promise = $http
            .post(url.userServices, {
                user_id: shared.getUser().id,
                user_token: shared.getUser().token
            }, {
                headers: shared.getHeaders()
            })
            .success(function(data, status, headers, config) {
                shared.hideLoading();
                userServices = data;
            })
            .error(function(data, status, headers, config) {
                shared.hideLoading();
                shared.alert(data);
            });

        return {
            promise: promise,
            getData: function() {
                return userServices;
            }
        };
    })

    .config(function($stateProvider) {
        $stateProvider
            .state('menu.service', {
                url: '/service',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/menu/service.html'
                    }
                },
                resolve: {
                    'ResolveUserServices': function(getUserServices) {
                        return getUserServices.promise;
                    }
                }
            });
    })

    .controller('serviceCtrl', function($scope, $ionicModal, $http, getUserServices, shared, url) {
        $ionicModal.fromTemplateUrl('service-detail', {
            scope: $scope
        }).then(function(modal) {
            $scope.showDetailModel = modal;
        });

        $scope.showDetail = function() {
            $scope.showDetailModel.show();
        };

        $scope.hideDetail = function() {
            $scope.showDetailModel.hide();
        };

        $scope.shown = {
            "DONE": true,
            "IN_PROGRESS": true,
            "RESERVED": true
        };

        $scope.userServices = getUserServices.getData();
        $scope.done = [];
        $scope.inProgress = [];
        $scope.reservation = [];

        for (var i = 0; i < $scope.userServices.length; i++) {
            if ($scope.userServices[i].status === "DONE") {
                $scope.done.push($scope.userServices[i]);
            } else if ($scope.userServices[i].status === "IN_PROGRESS") {
                $scope.inProgress.push($scope.userServices[i]);
            } else if ($scope.userServices[i].status === "RESERVED") {
                $scope.reservation.push($scope.userServices[i]);
            }
        }

        $scope.toggle = function(section) {
            $scope.shown[section] = !$scope.shown[section];
        };

        $scope.isShown = function(section) {
            return $scope.shown[section];
        };
    });
