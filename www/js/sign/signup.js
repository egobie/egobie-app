angular.module('app.sign.up', ['ionic', 'util.shared', 'util.url'])

    .controller('signUpCtrl', function(shared, url, $scope, $state, $http) {
        $scope.signUpForm = {
            username: "",
            password1: "",
            password2: "",
            email: "",
            coupon: ""
        };

        $scope.signUp = function() {
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
