angular.module('app.coupon', ['ionic', 'ngCordova', 'util.shared'])

    .config(function($stateProvider) {
        $stateProvider
            .state('menu.coupon', {
                url: '/coupon',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/coupon/coupon.html'
                    }
                }
            });
    })

    .controller('couponCtrl', function($scope, $cordovaSocialSharing, shared) {
        shared.goCoupon();

        $scope.coupon = shared.getUser().coupon;
        $scope._body = 'Enjoy eGobie car service now! Use my coupon code "' + $scope.coupon + '" to sign up and get 10% off your first booking!';

        $scope.shareByMessage = function() {
            $cordovaSocialSharing
                .shareViaSMS($scope._body, '')
                .then(function() {
                }, function(err) {
                    
                });
        };

        $scope.shareByEmail = function() {
            $cordovaSocialSharing
                .shareViaEmail($scope._body, "eGobie Invitation Code", [], [], [], null)
                .then(function() {
                }, function(err) {
                });
        };

        $scope.shareByFacebook = function() {
            $cordovaSocialSharing
                .shareViaFacebook($scope._body)
                .then(function() {
                }, function(err) {
                });
        };

        $scope.shareByTwitter = function() {
            $cordovaSocialSharing
                .shareViaTwitter($scope._body)
                .then(function() {
                }, function(err) {
                });
        };
    });
