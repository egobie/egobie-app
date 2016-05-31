angular.module('app.about', ['ionic', 'util.url', 'util.shared'])

    .config(function($stateProvider) {
        $stateProvider
            .state('menu.about', {
                url: '/about',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/about/about.html'
                    }
                }
            });
    })

    .controller('aboutCtrl', function($scope, $ionicModal, shared, url) {
        shared.goAbout();

        $scope.openWebsite = function() {
            window.open(url.website, "_blank", "location=no");
        };

        $scope.openFAQ = function() {
            window.open(url.faq, "_blank", "location=no");
        };

        $ionicModal.fromTemplateUrl('templates/about/feedback.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.feedbackModel = modal;
        });

        $scope.showFeedback = function() {
            shared.openFeedback();
            $scope.feedbackModel.show();
        };
    });