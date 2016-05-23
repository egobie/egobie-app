angular.module('app.about', ['ionic', 'util.url', 'util.shared'])

    .config(function($stateProvider) {
        $stateProvider
            .state('menu.about', {
                url: '/about',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/about/index.html'
                    }
                }
            });
    })

    .controller('aboutCtrl', function($scope, $ionicModal, url) {
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
            $scope.feedbackModel.show();
        };
    });