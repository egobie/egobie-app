/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('app.history', ['ionic', 'util.shared', 'util.url'])

    .controller('historytrl', function($scope, $ionicModal, $http, shared, url) {
        $scope.histories = shared.getUserHistories();
        $scope.max = 5;
        $scope.selectedHistory = null;
        $scope.historyModel = null;

        $ionicModal.fromTemplateUrl('history-detail', {
            scope: $scope
        }).then(function(modal) {
            $scope.historyModel = modal;
        });

        $scope.showHistory = function(id) {
            $scope.selectedHistory = shared.getUserHistory(id);
            console.log($scope.selectedHistory);
            $scope.historyModel.show();
        };

        $scope.hideHistory = function() {
            $scope.selectedHistory = null;
            $scope.historyModel.hide();
        };

        $scope.historyLabelStyle = function(rating) {
            // 0.0 - 1.0
            if (rating <= 1) {
                return {
                    'label-bad': true
                };
            // 1.5 - 2.5
            } else if (rating < 3) {
                return {
                    'label-warning': true
                };
            // 3.0 - 4.0
            } else if (rating <= 4) {
                return {
                    'label-info': true
                };
            } else {
                return {
                    'label-success': true
                };
            }
        };

        $scope.historyPercent = function(value) {
            return (100 * (value / $scope.max)) + '%';
        };
    });
