angular.module('app.setting.user', ['ionic', 'util.shared', 'util.url'])

    .controller('userEditCtrl', function($scope, $state, $http, $timeout, shared, url) {
        $scope.title = "USER ACCOUNT";

        console.log($scope._egobie);

        if ($scope._egobie) {
            $scope.title = "SETUP PROFILE";
        }

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

                    if ($scope._egobie) {
                        $timeout(function() {
                            var temp = $scope._egobie;
                            delete $scope._egobie;
                            $state.go(temp);
                        }, 500);
                    }
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

