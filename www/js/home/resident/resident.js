angular.module('app.home.resident', ['ionic'])

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
                        templateUrl: 'templates/home/resident/reservation.html'
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

            .state('menu.home.residentAddon', {
                url: '/resident/reservation/addon',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/addon.html'
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
    });
