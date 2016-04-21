angular.module('app.sign', ['ionic', 'util.shared', 'util.url'])

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

            // Sign
            .state('sign', {
                url: '/sign',
                templateUrl: 'templates/sign.html',
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
    })

    .controller('signInCtrl', function(shared, url, $scope, $state, $http, $ionicPopup) {
        $scope.signInForm = {
            "username": "signInForm-username",
            "password": "signInForm-password"
        };

        $scope.signIn = function() {
            var body = {
                "username": document.getElementById($scope.signInForm.username).value,
                "password": document.getElementById($scope.signInForm.password).value
            };

            if (!validateUser(body.username, body.password)) {
                return;
            }

            shared.showLoading();

            $http
                .post(url.signIn, body, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .success(function(data, status, headers, config) {
                    shared.refreshUser(data);
                    $state.go('menu.home');
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });

            function validateUser(username, password) {
                if (!username) {
                    $ionicPopup.alert({
                        title: "Username should not be empty"
                    });
                    
                    return false;
                }

                if (!password) {
                    $ionicPopup.alert({
                        title: "Password should not be empty"
                    });
                    
                    return false;
                }

                return true;
            }
        };
    })

    .controller('signUpCtrl', function(shared, url, $scope, $state, $http, $ionicPopup) {
        $scope.signUpForm = {
            minUsername: shared.minUsername,
            maxUsername: shared.maxUsername,
            minPassword: shared.minPassword,
            maxPassword: shared.maxPassword,
            username: "signUpForm-username",
            password1: "signUpForm-password1",
            password2: "signUpForm-password2",
            email: "signUpForm-email"
        };

        $scope.signUp = function() {
            var username = document.getElementById($scope.signUpForm.username).value;
            var password1 = document.getElementById($scope.signUpForm.password1).value;
            var password2 = document.getElementById($scope.signUpForm.password2).value;
            var email = document.getElementById($scope.signUpForm.email).value;

            var body = {
                "username": username,
                "password": password1,
                "email": email,
                "phone_number": null
            };

//            if (!validateUser(username, password1, password2, email)) {
//                return;
//            }
//
//            shared.showLoading();
//
//            $http
//                .post(url.signUp, body, {
//                    headers: {
//                        "Content-Type": "application/json"
//                    }
//                })
//                .success(function(data, status, headers, config) {
//                    shared.refreshUser(data);
//                    $state.go('tutorial');
//                })
//                .error(function(data, status, headers, config) {
//                    shared.hideLoading();
//                    shared.alert(data);
//                });
            $state.go('tutorial');

            function validateUser(username, password1, password2, email) {
                if (username.length < shared.minUsername) {
                    $ionicPopup.alert({
                        title: "Username must be at least " + shared.minUsername + " characters!"
                    });

                    return false;
                }

                if (username.length > shared.maxUsername) {
                    $ionicPopup.alert({
                        title: "Username must be at most " + shared.maxUsername + " characters!"
                    });

                    return false;
                }

                if (password1 !== password2) {
                    $ionicPopup.alert({
                        title: "Password is not equal!"
                    });

                    return false;
                }

                if (password1.length < shared.minPassword) {
                    $ionicPopup.alert({
                        title: "Password must be at least " + shared.minPassword + " characters!"
                    });

                    return false;
                }

                if (password1.length > shared.maxPassword) {
                    $ionicPopup.alert({
                        title: "Password must be at most " + shared.maxPassword + " characters!"
                    });

                    return false;
                }

                if (!shared.testEmail(email)) {
                    $ionicPopup.alert({
                        title: "Invalid Email Address!"
                    });

                    return false;
                }

                return true;
            }
        };
    });
