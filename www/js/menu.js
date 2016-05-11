angular.module('app.menu', ['util.request'])

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
                abstract: true,
                resolve: {
                    resolveUserCars: function(requestUserCars) {
                        return requestUserCars.promise;
                    },
                    resolveCarMakers: function(requestCarMakers) {
                        return requestCarMakers.promise;
                    },
                    resolveCarModels: function(requestCarModels) {
                        return requestCarModels.promise;
                    },
                    resolveServices: function(requestServices) {
                        return requestServices.promise;
                    },
                    resolveUserPayments: function(requestUserPayments) {
                        return requestUserPayments.promise;
                    }
//                    resolveUserServices: function(requestUserServices) {
//                        return requestUserServices.promise;
//                    },
//                    resolveUserHistories: function(requestUserHistories) {
//                        return requestUserHistories.promise;
//                    }
                }
            })

            .state('menu.home', {
                url: '/home',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/menu/home.html'
                    }
                }
            })

            .state('menu.notification', {
                url: '/notification',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/menu/notification.html'
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

            .state('menu.coupon', {
                url: '/coupon',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/menu/coupon.html'
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
            })

            .state('menu.about', {
                url: '/about',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/menu/about.html'
                    }
                }
            });

//        $urlRouterProvider.otherwise('/menu/home');
    }
);