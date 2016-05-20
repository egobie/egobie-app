/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('app.home', ['ionic', 'ionic.rating'])

    .config(function($stateProvider) {

        $stateProvider

            .state('menu.home.resident', {
                url: '/resident',
                views: {
                    'resident-view': {
                        templateUrl: 'templates/home/resident/index.html'
                    }
                }
            })

            .state('menu.home.mall', {
                url: '/mall',
                views: {
                    'mall-view': {
                        templateUrl: 'templates/home/mall/index.html'
                    }
                }
            })

            .state('menu.home.business', {
                url: '/business',
                views: {
                    'business-view': {
                        templateUrl: 'templates/home/business/index.html'
                    }
                }
            });
    })

    .factory('locations', function() {
        return [
            {
                name: 'Woodbury',
                rating: 1,
                service: {
                    carWash: 1,
                    oilChange: 2,
                    detail: 1
                }
            },
            {
                name: 'Garden State Plaza',
                rating: 2.5,
                service: {
                    carWash: 1,
                    oilChange: 2,
                    detail: 1
                }
            },
            {
                name: 'New Bridge Landing',
                rating: 4,
                service: {
                    carWash: 1,
                    oilChange: 2,
                    detail: 1
                }
            }
        ];
    })

    .controller('locationsCtrl', function($scope, $state, $ionicActionSheet, locations) {

        $scope.locations = locations;
        $scope.max = 5;

        $scope.labelStyle = function(rating) {
            if (rating < 2) {
                return {
                    'label-warning': true
                };
            } else if (rating < 4) {
                return {
                    'label-info': true
                };
            } else {
                return {
                    'label-success': true
                };
            }
        };

        $scope.percent = function(value) {
            return (100 * (value / $scope.max)) + '%';
        };

        $scope.showActionsheet = function(name) {

            $scope.hideSheet = $ionicActionSheet.show({
                titleText: 'Make a reservation',
                buttons: [
                    {text: 'Reserve'}
                ],
                buttonClicked: function(index) {
                    $scope.hideSheet();
                    $state.go('menu.home.two');
                },
                cancelText: 'Close',
                cancel: function() {
                    
                }
            });
        };
    })

    .controller('reservationCtrl', function($scope, $ionicActionSheet) {

        $scope.showReservationSheet = function() {

            $scope.hideReservationSheet = $ionicActionSheet.show({
                titleText: 'Make a Reservation',
                destructiveText: 'Place Order',
                destructiveButtonClicked: function() {
                    $scope.hideReservationSheet();
                },
                cancelText: 'Cancel',
                cancel: function() {
                    
                }
            });
        };
    });
