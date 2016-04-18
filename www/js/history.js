/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('app.history', ['ionic'])

    .factory('histories', function() {
        return [
            {
                "license": "Y96EUV",
                "maker": "Honda",
                "model": "Accord",
                "datetime": "Nov 05, 2015, 13:50:51",
                "price": "$20.50",
                "rating": 1.5
            },
            {
                "license": "Y96EUV",
                "maker": "Honda",
                "model": "Accord",
                "datetime": "Nov 05, 2015, 13:50:51",
                "price": "$20.50",
                "rating": 2.5
            },
            {
                "license": "Y96EUV",
                "maker": "Honda",
                "model": "Accord",
                "datetime": "Nov 05, 2015, 13:50:51",
                "price": "$20.50",
                "rating": 3.5
            },
            {
                "license": "Y96EUV",
                "maker": "Honda",
                "model": "Accord",
                "datetime": "Nov 05, 2015, 13:50:51",
                "price": "$20.50",
                "rating": 4.5
            },
            {
                "license": "Y96EUV",
                "maker": "Honda",
                "model": "Accord",
                "datetime": "Nov 05, 2015, 13:50:51",
                "price": "$20.50",
                "rating": 5
            }
        ];
    })

    .controller('historyDetailCtrl', function($scope, $ionicModal, histories) {
        $scope.histories = histories;
        $scope.max = 5;

        $ionicModal.fromTemplateUrl('history-detail', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.historyLabelStyle = function(rating) {
            if (rating < 2) {
                return {
                    'label-warning': true
                };
            } else if (rating < 4) {
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
