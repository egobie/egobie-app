angular.module('app.setting.user', ['ionic', 'util.shared', 'util.url'])

    .controller('userEditCtrl', function($scope, $http, shared, url) {
        $scope.user = {
            first: shared.getUser().first,
            last : shared.getUser().last,
            middle: shared.getUser().middle,
            email: shared.getUser().email,
            phone: shared.getUser().phone
        };

        $scope.hideEditUser = function() {
            $scope.editUserModal.hide();
            $scope.editUserModal.remove();
        };

        $scope.editUser = function() {
            var user = {
                first_name: $scope.user.first,
                last_name: $scope.user.last,
                middle_name: $scope.user.middle,
                email: $scope.user.email,
                phone_number: $scope.user.phone
            };

            if (!validateUser(user)) {
                return;
            }

            shared.showLoading();

            $http
                .post(url.updateUser, shared.getRequestBody(user))
                .success(function(data, status, hearders, config) {
                    shared.refreshUser(data);
                    shared.hideLoading();
                    $scope.hideEditUser();
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        function validateUser(user) {
            if (!user.first_name) {
                shared.alert("Please input First Name!");
                return false;
            }

            if (!user.last_name) {
                shared.alert("Please input Last Name!");
                return false;
            }

            if (!user.email) {
                shared.alert("Please input email!");
                return false;
            }

            if (!user.phone_number) {
                shared.alert("Please input Phone Number!");
                return false;
            }

            return true;
        };
    });

