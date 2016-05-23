angular.module('app.about.feedback', ['ionic', 'util.url', 'util.shared'])

    .controller('feedbackCtrl', function($scope, $ionicPopup, $http, shared, url) {
        $scope.hideFeedback = function() {
            $scope.feedbackModel.hide();
        };

        $scope.feedback = {
            title: "",
            feedback: ""
        };

        $scope.sendFeedback = function() {
            if (!$scope.feedback.title) {
                shared.alert("Please input the title");
                return;
            }

            if (!$scope.feedback.feedback) {
                shared.alert("Please input the feedback");
                return;
            }

            shared.showLoading();

            $http
                .post(url.feedback, shared.getRequestBody({
                    title: $scope.feedback.title,
                    feedback: $scope.feedback.feedback
                }))
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    $ionicPopup.show({
                        title: "Thanks for your feedback! Your suggestions make us better!",
                        buttons: [{
                            text: 'OK',
                            type: 'button-positive',
                            onTap: function() {
                                $scope.hideFeedback();
                            }
                        }]
                    });
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };
    });