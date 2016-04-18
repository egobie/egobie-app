/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('app.setting', ['ionic', 'util.shared', 'util.url'])

    .controller('settingCtrl', function($scope, $ionicModal, $ionicPopup, $http, shared, url) {
        $scope.user = {
            first: shared.getUser().first,
            last : shared.getUser().last,
            middle: shared.getUser().middle,
            email: shared.getUser().email,
            phone: shared.getUser().phone
        };

        $scope.password = {
            old: "",
            new1: "",
            new2: ""
        };

        $scope.home = {
            state: shared.getUser().home_state,
            city: shared.getUser().home_city,
            zip: shared.getUser().home_zip,
            street: shared.getUser().home_street
        };

        $scope.work = {
            state: shared.getUser().work_state,
            city: shared.getUser().work_city,
            zip: shared.getUser().work_zip,
            street: shared.getUser().work_street
        };

        console.log("Home - ", $scope.home);
        console.log("Work - ", $scope.work);

        $scope.states = shared.getStates();

        $ionicModal.fromTemplateUrl('edit-user', {
            scope: $scope
        }).then(function(modal) {
            $scope.editUserModal = modal;
        });

        $scope.showEditUser = function() {
            $scope.editUserModal.show();
        };

        $scope.hideEditUser = function() {
            $scope.editUserModal.hide();
        };

        $ionicModal.fromTemplateUrl('edit-password', {
            scope: $scope
        }).then(function(modal) {
            $scope.editPasswordModal = modal;
        });

        $scope.showEditPassword = function() {
            $scope.password.old = "";
            $scope.password.new1 = "";
            $scope.password.new2 = "";
            $scope.editPasswordModal.show();
        };

        $scope.hideEditPassword = function() {
            $scope.editPasswordModal.hide();
        };

        $ionicModal.fromTemplateUrl('edit-home', {
            scope: $scope
        }).then(function(modal) {
            $scope.editHomeModal = modal;
        });

        $scope.showEditHome = function() {
            $scope.editHomeModal.show();
        };

        $scope.hideEditHome = function() {
            $scope.editHomeModal.hide();
        };

        $ionicModal.fromTemplateUrl('edit-work', {
            scope: $scope
        }).then(function(modal) {
            $scope.editWorkModal = modal;
        });

        $scope.showEditWork = function() {
            $scope.editWorkModal.show();
        };

        $scope.hideEditWork = function() {
            $scope.editWorkModal.hide();
        };

        $scope.editUser = function() {
            var user = {
                user_id: shared.getUser().id,
                user_token: shared.getUser().token,
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

            setTimeout(function() {
            $http
                .post(url.updateUser, user, {
                    headers: shared.getHeaders()
                })
                .success(function(data, status, hearders, config) {
                    shared.refreshUser(data);
                    shared.hideLoading();
                    $scope.hideEditUser();
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
            }, 1000);
        };

        $scope.editPassword = function() {
            var password = {
                user_id: shared.getUser().id,
                user_token: shared.getUser().token,
                password: $scope.password.old,
                new_password: $scope.password.new1
            };

            if (!validatePassword($scope.password)) {
                return;
            }

            shared.showLoading();

            $http
                .post(url.updatePassword, password, {
                    headers: shared.getHeaders()
                })
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

        $scope.editHome = function() {
            var address = {
                user_id: shared.getUser().id,
                user_token: shared.getUser().token,
                state: $scope.home.state,
                city: $scope.home.city,
                zip: $scope.home.zip,
                street: $scope.home.street
            };

            if (!validateAddress(address)) {
                return;
            }

            console.log(address);
            shared.showLoading();

            setTimeout(function() {
            $http
                .post(url.updateHome, address, {
                    headers: shared.getHeaders()
                })
                .success(function(data, status, hearders, config) {
                    shared.refreshHome(data);
                    shared.hideLoading();
                    $scope.hideEditHome();
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
            }, 1000);
        };

        $scope.editWork = function() {
            var address = {
                user_id: shared.getUser().id,
                user_token: shared.getUser().token,
                state: $scope.work.state,
                city: $scope.work.city,
                zip: $scope.work.zip,
                street: $scope.work.street
            };

            if (!validateAddress(address)) {
                return;
            }

            console.log(address);
            shared.showLoading();

            setTimeout(function() {
            $http
                .post(url.updateWork, address, {
                    headers: shared.getHeaders()
                })
                .success(function(data, status, hearders, config) {
                    shared.refreshWork(address);
                    shared.hideLoading();
                    $scope.hideEditWork();
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
            }, 1000);
        };

        function validateUser(user) {
            if (!user.first_name) {
                $ionicPopup.alert({
                    title: "Please input First Name!"
                });
                return false;
            }

            if (!user.last_name) {
                $ionicPopup.alert({
                    title: "Please input Last Name!"
                });
                return false;
            }

            if (!user.email) {
                $ionicPopup.alert({
                    title: "Please input email!"
                });
                return false;
            }

            if (!user.phone_number) {
                $ionicPopup.alert({
                    title: "Please input Phone Number!"
                });
                return false;
            }

            return true;
        };

        function validatePassword(password) {
            if (!password.old) {
                $ionicPopup.alert({
                    title: "Please input current password!"
                });
                return false;
            }

            if (password.new1 !== password.new2) {
                $ionicPopup.alert({
                    title: "New password is not equal!"
                });
                return false;
            }

//            if (password.new1.length < shared.minPassword) {
//                $ionicPopup.alert({
//                    title: "Password must be at least " + shared.minPassword + " characters!"
//                });
//                return false;
//            }
//
//            if (password.new1.length > shared.maxPassword) {
//                $ionicPopup.alert({
//                    title: "Password must be at most " + shared.maxPassword + " characters!"
//                });
//                return false;
//            }

            if (password.old === password.new1) {
                $ionicPopup.alert({
                    title: "Old and new Passwords should not be the same!"
                });
                return false;
            }

            return true;
        };

        function validateAddress(address) {
            if (!address.state) {
                $ionicPopup.alert({
                    title: "Please input State!"
                });
                return false;
            }

            if (!address.city) {
                $ionicPopup.alert({
                    title: "Please input City!"
                });
                return false;
            }

            if (!address.zip) {
                $ionicPopup.alert({
                    title: "Please input Zipcode!"
                });
                return false;
            }

            if (!address.street) {
                $ionicPopup.alert({
                    title: "Please input Street!"
                });
                return false;
            }

            return true;
        };
    });

