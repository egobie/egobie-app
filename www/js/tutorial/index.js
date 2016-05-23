angular.module('app.tutorial', ['ionic'])

    .config(function($stateProvider) {

        $stateProvider

            .state('tutorial', {
                url: '/tutorial',
                templateUrl: 'templates/tutorial/index.html',
                controller: 'tutorialCtrl'
            });
    })

    .controller('tutorialCtrl', function($scope, $state, $ionicSlideBoxDelegate) {

        $scope.slideIndex = 0;

        $scope.next = function() {
            $ionicSlideBoxDelegate.next();
        };

        $scope.previous = function() {
            $ionicSlideBoxDelegate.previous();
        };

        $scope.startToUse = function() {
            $state.go('menu.home.resident');
        };

        $scope.slideChanged = function($index) {
            $scope.slideIndex = $index;
        };
    });