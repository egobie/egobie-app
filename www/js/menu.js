angular.module('app.menu', ['ionic', 'util.request', 'util.shared'])

    .config(function($stateProvider, $ionicConfigProvider) {
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        // $ionicConfigProvider.views.maxCache(10);
        $ionicConfigProvider.views.transition('platform');
        $ionicConfigProvider.views.swipeBackEnabled(false);
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

            .state('menu.task', {
                url: '/task',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/menu/task.html'
                    }
                }
            });
    })

    .controller('menuCtrl', function($scope, shared) {
        $scope.user = {
            name: shared.getUser().first || "Welcome",
            isResidential: shared.isResidential()
        };

        shared.setMenuScope($scope);
    });