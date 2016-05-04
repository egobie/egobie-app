angular.module('app.coupon', ['ionic', 'ngCordova', 'util.shared'])

    .controller('couponCtrl', function($scope, $cordovaSocialSharing, shared) {
        $scope._body = 'Enjoy eGobie car service now! Use my coupon code: ' + $scope.coupon + ' to sign up and get 10% off your first booking!';
        $scope.coupon = shared.getUser().coupon;

        $scope.shareByMessage = function() {
            $cordovaSocialSharing
                .shareViaSMS($scope._body, '')
                .then(function() {
                    shared.alert("SMS - OK");
                }, function(err) {
                    shared.alert("SMS - error - ", err);
                });
        };

        $scope.shareByEmail = function() {
            $cordovaSocialSharing
                .shareViaEmail($scope._body, "eGobie Invitation Code", [], [], [], null)
                .then(function() {
                    shared.alert("Email - OK");
                }, function(err) {
                    shared.alert("Email - error - ", err);
                });
        };

        $scope.shareByFacebook = function() {
            $cordovaSocialSharing
                .shareViaFacebook($scope._body)
                .then(function() {
                    shared.alert("Facebook - OK");
                }, function(err) {
                    shared.alert("Facebook - error - ", err);
                });
        };

        $scope.shareByTwitter = function() {
            $cordovaSocialSharing
                .shareViaTwitter($scope._body)
                .then(function() {
                    shared.alert("Twitter - OK");
                }, function(err) {
                    shared.alert("Twitter - error - ", err);
                });
        };
    });
