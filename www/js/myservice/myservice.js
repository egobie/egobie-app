angular.module('app.myservice', ['ionic', 'util.shared', 'util.url'])

    .config(function($stateProvider) {
        $stateProvider

            .state('menu.myservice', {
                url: '/myservice',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/myservice/myservice.html'
                    }
                }
            })

            .state('menu.myservice.reservation', {
                url: '/reservation',
                views: {
                    'reservation-view': {
                        templateUrl: 'templates/myservice/reservation/reservation.html'
                    }
                }
            })

            .state('menu.myservice.history', {
                url: '/history',
                views: {
                    'history-view': {
                        templateUrl: 'templates/myservice/history/history.html'
                    }
                }
            });
    });