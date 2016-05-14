angular.module('app.setting.password', ['ionic', 'util.shared', 'util.url'])

    .controller('passwordEditCtrl', function($scope, $http, shared, url) {
        $scope.password = {
            old: "",
            new1: "",
            new2: ""
        };

        $scope.hideEditPassword = function() {
            $scope.editPasswordModal.hide();
            $scope.editPasswordModal.remove();
        };

        $scope.editPassword = function() {
            var password = {
                password: $scope.password.old,
                new_password: $scope.password.new1
            };

            if (!validatePassword($scope.password)) {
                return;
            }

            shared.showLoading();

            $http
                .post(url.updatePassword, shared.getRequestBody(password))
                .success(function(data, status, headers, config) {
                    shared.refreshUserToken(data.token);
                    shared.hideLoading();
                    $scope.hideEditPassword();
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        function validatePassword(password) {
            if (!password.old) {
                shared.alert("Please input current password!");
                return false;
            }

            if (password.new1 !== password.new2) {
                shared.alert("New password is not equal!");
                return false;
            }

            if (password.old === password.new1) {
                shared.alert("Old and new Passwords should not be the same!");
                return false;
            }

            return true;
        };
    });

