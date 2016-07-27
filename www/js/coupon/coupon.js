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

    .controller('couponCtrl', function($scope, $ionicModal, shared) {
        shared.goCoupon();

        $scope._showInput = false;

        $ionicModal.fromTemplateUrl('templates/coupon/invite.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.addCouponInviteModal = modal;
        });

        $scope.showCouponInvite = function() {
            $scope.addCouponInviteModal.show();
        };

        $scope.showCouponInput = function () {
            return $scope._showInput;
        };

        $scope.toggleCouponInput = function() {
            $scope._showInput = !$scope._showInput;
        };
    });
