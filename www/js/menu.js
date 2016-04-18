angular.module('app.menu', [])

    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        // $ionicConfigProvider.views.maxCache(10);
        $ionicConfigProvider.views.transition('platform');
        // $ionicConfigProvider.views.forwardCache(false);
        $ionicConfigProvider.backButton.icon('ion-ios-arrow-back');
        $ionicConfigProvider.backButton.text('');                  // default is 'Back'
        $ionicConfigProvider.backButton.previousTitleText(false);  // hides the 'Back' text
        // $ionicConfigProvider.templates.maxPrefetch(20);

        $stateProvider

            // Side Menu
            .state('menu', {
                url: '/menu',
                templateUrl: 'templates/menu.html',
                abstract: true
            })

            .state('menu.home', {
                url: '/home',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/menu/home.html'
                    }
                }
            })

            .state('menu.service', {
                url: '/service',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/menu/service.html'
                    }
                }
            })

            .state('menu.payment', {
                url: '/payment',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/menu/payment.html'
                    }
                }
            })

            .state('menu.car', {
                url: '/car',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/menu/car.html'
                    }
                }
            })

            .state('menu.history', {
                url: '/history',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/menu/history.html'
                    }
                }
            })

            .state('menu.setting', {
                url: '/setting',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/menu/setting.html'
                    }
                }
            });

//        $urlRouterProvider.otherwise('/menu/home');
    }
);