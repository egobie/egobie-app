angular.module('app.sign', ['ionic', 'util.shared', 'util.url'])

    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

            // Sign
            .state('sign', {
                url: '/sign',
                templateUrl: 'templates/sign/index.html',
                abstract: true
            })

            // Sign In
            .state('sign.in', {
                url: '/in',
                views: {
                    'sign-view': {
                        templateUrl: 'templates/sign/signin.html'
                    }
                }
            })

            .state('sign.up', {
                url: '/up',
                views: {
                    'sign-view': {
                        templateUrl: 'templates/sign/signup.html'
                    }
                }
            });

        $urlRouterProvider.otherwise('/sign/in');
    });