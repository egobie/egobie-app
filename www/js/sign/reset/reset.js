angular.module('app.sign.reset', ['ionic', 'util.shared', 'util.url'])

    .controller('resetPasswordCtrl', function($scope, $interval, $http, $timeout, shared, url) {
        $scope.reset = {
            step: 1,
            userId: -1,
            username: "",
            token: "",
            password1: "",
            password2: "",
            countdown: 0,
            timer: null
        };

        $scope.$on('$destroy', function() {
            if ($scope.reset.timer) {
                $interval.cancel($scope.reset.timer);
            }
        });

        $scope.gotoStep2 = function() {
            if ($scope.reset.username.trim().length === 0) {
                shared.alert("Please input username");
                return;
            }

            shared.showLoading();
            $http
                .post(url.resetPassword1, {
                    username: $scope.reset.username
                })
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    $scope.reset.userId = data.user_id;
                    $scope.reset.username = data.username;
                    $scope.reset.step = 2;
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.gotoStep3 = function() {
            var token = $scope.reset.token.trim();

            if (token.length < 5 || token.length > 10) {
                shared.alert("Invalid token");
                return;
            }

            shared.showLoading();
            $http
                .post(url.resetPassword2, {
                    user_id: $scope.reset.userId,
                    token: $scope.reset.token
                })
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    $scope.reset.step = 3;

                    if ($scope.reset.timer) {
                        $interval.cancel($scope.reset.timer);
                    }
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.resetPassword = function() {
            if ($scope.reset.password1.trim().length === 0 || 
                    $scope.reset.password1 !== $scope.reset.password2) {
                shared.alert("Password is not equal");
                return;
            }

            shared.showLoading();
            $http
                .post(url.resetPassword3, {
                    user_id: $scope.reset.userId,
                    token: $scope.reset.token,
                    password: $scope.reset.password1
                })
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert("Reset password successfully!");
                    $scope.hideResetPassword();
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.resendResetEmail = function() {
            if ($scope.reset.countdown > 0) {
                return;
            }

            shared.showLoading();
            $http
                .post(url.resetResend, {
                    user_id: $scope.reset.userId,
                    username: $scope.reset.username
                })
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert("The email has been sent");

                    $scope.reset.countdown = 60;
                    $scope.reset.timer = $interval(function() {
                        $scope.reset.countdown--;

                        if ($scope.reset.countdown <= 0) {
                            $scope.reset.countdown = 0;
                            $interval.cancel($scope.reset.timer);
                        }
                    }, 1000);
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.isDisabled = function() {
            return {
                'egobie-button-disabled': $scope.reset.countdown > 0
            };
        };

        $scope.hideResetPassword = function() {
            $scope.resetPasswordModal.hide();
            $timeout(function() {
                $scope.resetPasswordModal.remove();
            }, 300);
        };
    });
