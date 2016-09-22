angular.module('app.coupon', ['ionic', 'ngCordova', 'util.shared', 'util.url'])

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

    .controller('couponCtrl', function($scope, $http, $ionicModal, shared, url) {
        shared.goCoupon();

        $scope.coupon = {
            code: "",
            firstDiscount: shared.getDiscount("RESIDENTIAL_FIRST"),
            fistTime: shared.getUser().first_time > 0,
            inviteDiscount: shared.getDiscount("RESIDENTIAL"),
            inviteTime: shared.getUser().discount,
            couponDiscount: null,
            showInput: false
        };

        $scope.$watch(function() {
            return shared.getUser().coupon_discount;
        }, function (newValue, oldValue) {
            $scope.coupon.couponDiscount = newValue;
        });

        $ionicModal.fromTemplateUrl('templates/coupon/invite.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.addCouponInviteModal = modal;
        });

        $scope.showCouponInvite = function() {
            $scope.addCouponInviteModal.show();
        };

        $scope.getCouponDiscountInfo = function() {
            var temp = $scope.coupon.couponDiscount;

            if (temp.percent === 1) {
                return temp.discount + "%";
            } else {
                return "$" + temp.discount;
            }
        };

        $scope.applyCoupon = function() {
            if (!$scope.coupon.code) {
                shared.alert("Invalid Coupon Code");
                return;
            }

            shared.showLoading();
            $http
                .post(url.applyCoupon, shared.getRequestBody({
                    code: $scope.coupon.code.toUpperCase()
                }))
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.getCoupon();
                    $scope.toggleCouponInput();
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.toggleCouponInput = function() {
            $scope.coupon.code = "";
            $scope.coupon.showInput = !$scope.coupon.showInput;
        };
    });
