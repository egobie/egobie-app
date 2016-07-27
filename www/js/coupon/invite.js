angular.module('app.coupon.invite', ['ionic', 'ngCordova', 'util.shared'])

    .controller('couponInviteCtrl', function($scope, $cordovaSocialSharing, shared) {
        $scope.discount = {
            residential: shared.getDiscount("RESIDENTIAL")
        };
        $scope.coupon = shared.getUser().coupon;
        $scope._body = 'Enjoy eGobie car service now! Use my coupon code "' + $scope.coupon + '" to sign up and get ' + 
                $scope.discount.residential + '% off your first booking!';

        $scope.hideCouponInvite = function() {
            $scope.addCouponInviteModal.hide();
        };

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
