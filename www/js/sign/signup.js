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

            var username = document.getElementById("sign-up-username").value;
            var password1 = document.getElementById("sign-up-password1").value;
            var password2 = document.getElementById("sign-up-password2").value;
            var email = document.getElementById("sign-up-email").value;
            var coupon = document.getElementById("sign-up-coupon").value;

            var body = {
                "username": username,
                "password": password1,
                "email": email,
                "phone_number": null,
                "coupon": coupon
            };

            if (!validateUser(username, password1, password2, email, coupon)) {
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
            console.log($scope.signUpForm.username);

            if ($scope.signUpForm.username &&
                    $scope.signUpForm.username.length >= 6 &&
                        $scope.signUpForm.username.length <= 12) {
                $http
                    .post(url.checkUsername, {
                        "value": $scope.signUpForm.username
                    })
                    .success(function(data, status, headers, config) {
                        console.log(status);
                        $scope.nameInUse = (status !== 200);
                    })
                    .error(function(data, status, headers, config) {
                        shared.alert(data);
                        $scope.nameInUse = false;
                    });
            } else {
                $scope.nameInUse = false;
                console.log("name - ", $scope.nameInUse);
            }
        };

        $scope.checkEmail = function() {
            console.log($scope.signUpForm.email);

            if ($scope.signUpForm.email && shared.testEmail($scope.signUpForm.email)) {
                $http
                    .post(url.checkEmail, {
                        "value": $scope.signUpForm.email
                    })
                    .success(function(data, status, headers, config) {
                        console.log(status);
                        $scope.emailInUse = (status !== 200);
                    })
                    .error(function(data, status, headers, config) {
                        shared.alert(data);
                        $scope.emailInUse = false;
                    });
            } else {
                $scope.emailInUse = false;
                console.log("email - ", $scope.emailInUse);
            }
        };

        function validateUser(username, password1, password2, email, coupon) {
            if (username.length < shared.minUsername) {
                shared.alert("Username must be at least 6 characters!");
                return false;
            }

            if (username.length > shared.maxUsername) {
                shared.alert("Username must be at most 12 characters!");
                return false;
            }

            if (password1 !== password2) {
                shared.alert("Password is not equal!");
                return false;
            }

            if (password1.length < shared.minPassword) {
                shared.alert("Password must be at least 8 characters!");
                return false;
            }

            if (password1.length > shared.maxPassword) {
                shared.alert("Password must be at most 16 characters!");
                return false;
            }

            if (!shared.testEmail(email)) {
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
