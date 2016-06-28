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

    .controller('mapCtrl', function($scope, $ionicSideMenuDelegate, shared, map) {
        console.log("create");
        $ionicSideMenuDelegate.canDragContent(false);

        $scope.$on('$destroy', function() {
            console.log("destroy");
            $ionicSideMenuDelegate.canDragContent(true);
        });

        document.querySelector("#egobie-map .scroll").appendChild(map.getMap().getDiv());
    });