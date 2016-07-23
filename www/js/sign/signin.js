angular.module('app.sign.in', ['ionic', 'util.shared', 'util.url'])

    .controller('signInCtrl', function($scope, $state, $ionicModal, $http, shared, url) {
        $scope.signInForm = {
            username: "",
            password: ""
        };

        $scope.signIn = function() {
            var body = {
                username: $scope.signInForm.username,
                password: $scope.signInForm.password
            };

            if (!validateUser(body.username, body.password)) {
                return;
            }

            signIn(body);
        };

        $scope.showResetPassword = function() {
            (function() {
                $ionicModal.fromTemplateUrl('templates/sign/reset/reset.html', {
                    scope: $scope
                }).then(function(modal) {
                    $scope.resetPasswordModal = modal;
                    $scope.resetPasswordModal.show();
                });
            })();
        };

        function signIn(body) {
            shared.showLoading();

            $http
                .post(url.signIn, body)
                .success(function(data, status, headers, config) {
                    if (data.type !== 'RESIDENTIAL' && data.type !== 'EGOBIE') {
                        shared.hideLoading();
                        shared.alert("Invalid User");
                        return;
                    }

                    shared.setUserSignIn(body.username, body.password);
                    shared.refreshUser(data);

                    if (shared.isResidential()) {
                        $state.go('menu.home.resident');
                    } else {
                        $state.go('menu.task.residential');
                    }
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        }

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

        var userSignIn = shared.getUserSignIn();
        console.log("userSignIn - ", userSignIn);

        if (userSignIn.username && userSignIn.password) {
            signIn(userSignIn);
        }
    });
