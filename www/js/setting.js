angular.module('app.setting', ['ionic', 'util.shared', 'util.url'])

    .controller('settingCtrl', function($scope, $ionicModal, shared, url) {
        $scope.showEditUser = function() {
            $ionicModal.fromTemplateUrl('templates/setting/user.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.editUserModal = modal;
                $scope.editUserModal.show();
            });
        };

        $scope.showEditPassword = function() {
            $ionicModal.fromTemplateUrl('templates/setting/password.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.editPasswordModal = modal;
                $scope.editPasswordModal.show();
            });
        };

        $scope.showEditHome = function() {
            $ionicModal.fromTemplateUrl('templates/setting/home.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.editHomeModal = modal;
                $scope.editHomeModal.show();
            });
        };

        $scope.showEditWork = function() {
            $ionicModal.fromTemplateUrl('templates/setting/work.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.editWorkModal = modal;
                $scope.editWorkModal.show();
            });
        };
    });

