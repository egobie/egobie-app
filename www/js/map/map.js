angular.module('app.map', ['ionic', 'util.shared', 'util.map'])

    .config(function($stateProvider) {
        $stateProvider
            .state('menu.map', {
                url: '/map',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/map/map.html'
                    }
                }
            });
    })

    .controller('mapCtrl', function($scope, $ionicSideMenuDelegate, map) {
        $ionicSideMenuDelegate.canDragContent(false);
        console.log("can drag false");

        $scope.$on('$destroy', function() {
            $ionicSideMenuDelegate.canDragContent(true);
        });

        document.querySelector("#egobie-map .scroll").appendChild(map.getMap().getDiv());
    });