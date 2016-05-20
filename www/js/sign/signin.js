angular.module('app.sign.in', ['ionic', 'util.shared', 'util.url'])

    .controller('signInCtrl', function(shared, url, $scope, $state, $http) {
        $scope.signInForm = {
            username: "",
            password: ""
        };

        $scope.signIn = function() {
            var body = {
                "username": document.getElementById("sign-in-username").value,
                "password": document.getElementById("sign-in-password").value
            };

            if (!validateUser(body.username, body.password)) {
                return;
            }

            shared.showLoading();

            $http
                .post(url.signIn, body, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .success(function(data, status, headers, config) {
                    shared.refreshUser(data);

                    if (shared.isResidential()) {
                        $state.go('menu.home.resident');
                    } else {
                        $state.go('menu.task');
                    }
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        function validateUser(username, password) {
            if (!username) {
                shared.alert("Username should not be empty");
                return false;
            }

            if (!password) {
                shared.alert("Password should not be empty");
                return false;
            }

            return true;
        }
    });
