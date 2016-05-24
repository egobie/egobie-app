angular.module('app.history', ['ionic', 'util.shared', 'util.url'])

    .config(function($stateProvider) {
        $stateProvider

            .state('menu.history', {
                url: '/history',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/history/history.html'
                    }
                }
            });
    });