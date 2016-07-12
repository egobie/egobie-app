angular.module('app.sign.up', ['ionic', 'util.shared', 'util.url'])

    .controller('signUpCtrl', function(shared, url, $scope, $state, $http) {
        $scope.signUpForm = {
            username: "",
            password1: "",
            password2: "",
            email: "",
            coupon: ""
        };

        $scope.nameInUse = false;
        $scope.emailInUse = false;

        $scope.displayNameInUse = function() {
            return {
                "egobie-display-none": !$scope.nameInUse
            };
        };

        $scope.displayEmailInUse = function() {
            return {
                "egobie-display-none": !$scope.emailInUse
            };
        };

        $scope.inputNameInUse = function() {
            return {
                "egobie-in-use": $scope.nameInUse
            };
        };

        $scope.inputEmailInUse = function() {
            return {
                "egobie-in-use": $scope.emailInUse
            };
        };

        $scope.signUp = function() {
            if ($scope.nameInUse) {
                shared.alert("Username is in use");
                return;
            } else if ($scope.emailInUse) {
                shared.alert("Email address is in use");
                return;
            }

            var body = {
                "username": $scope.signUpForm.username,
                "password": $scope.signUpForm.password1,
                "email": $scope.signUpForm.email,
                "phone_number": null,
                "coupon": $scope.signUpForm.coupon
            };

            if (!validateUser(body.username, body.password, $scope.signUpForm.password2, body.email, body.coupon)) {
                return;
            }

            shared.showLoading();

            $http
                .post(url.signUp, body, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .success(function(data, status, headers, config) {
                    shared.setUserSignIn(body.username, body.password);
                    shared.refreshUser(data);
                    $state.go('tutorial');
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
//            $state.go('tutorial');
        };

        $scope.checkUsername = function() {
            if ($scope.signUpForm.username &&
                    $scope.signUpForm.username.length >= 6 && $scope.signUpForm.username.length <= 12) {
                $http
                    .post(url.checkUsername, {
                        "value": $scope.signUpForm.username
                    })
                    .success(function(data, status, headers, config) {
                        $scope.nameInUse = (status !== 200);
                    })
                    .error(function(data, status, headers, config) {
                        shared.alert(data);
                        $scope.nameInUse = false;
                    });
            } else {
                $scope.nameInUse = false;
            }
        };

        $scope.checkEmail = function() {
            if ($scope.signUpForm.email && shared.testEmail($scope.signUpForm.email)) {
                $http
                    .post(url.checkEmail, {
                        "value": $scope.signUpForm.email
                    })
                    .success(function(data, status, headers, config) {
                        $scope.emailInUse = (status !== 200);
                    })
                    .error(function(data, status, headers, config) {
                        shared.alert(data);
                        $scope.emailInUse = false;
                    });
            } else {
                $scope.emailInUse = false;
            }
        };

        function validateUser(username, password1, password2, email, coupon) {
            if (!username || username.length < 6) {
                shared.alert("Username must be at least 6 characters!");
                return false;
            }

            if (!username || username.length > 12) {
                shared.alert("Username must be at most 12 characters!");
                return false;
            }

            if (!password1 || password1.length < 8) {
                shared.alert("Password must be at least 8 characters!");
                return false;
            }

            if (!password1 || password1.length > 16) {
                shared.alert("Password must be at most 16 characters!");
                return false;
            }

            if (!password1 || !password2 || password1 !== password2) {
                shared.alert("Password is not equal!");
                return false;
            }

            if (!email || !shared.testEmail(email)) {
                shared.alert("Invalid Email Address!");
                return false;
            }

            if (coupon && !shared.testCoupon(coupon)) {
                shared.alert("Invalid Invitation Code!");
                return false;
            }

            return true;
        }
    });
