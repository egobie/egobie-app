angular.module('app.setting.work', ['ionic', 'util.shared', 'util.url'])

    .controller('workEditCtrl', function($scope, $http, shared, url) {
        $scope.states = shared.getStates();
        $scope.work = {
            state: shared.getUser().work_state,
            city: shared.getUser().work_city,
            zip: shared.getUser().work_zip,
            street: shared.getUser().work_street
        };

        $scope.hideEditWork = function() {
            $scope.editWorkModal.hide();
            $scope.editWorkModal.remove();
        };

        $scope.editWork = function() {
            var address = {
                user_id: shared.getUser().id,
                user_token: shared.getUser().token,
                state: $scope.work.state,
                city: $scope.work.city,
                zip: $scope.work.zip,
                street: $scope.work.street
            };

            if (!validateAddress(address)) {
                return;
            }

            shared.showLoading();

            $http
                .post(url.updateWork, address, {
                    headers: shared.getHeaders()
                })
                .success(function(data, status, hearders, config) {
                    shared.refreshWork(address);
                    shared.hideLoading();
                    $scope.hideEditWork();
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        function validateAddress(address) {
            if (!address.state) {
                shared.alert("Please input State!");
                return false;
            }

            if (!address.city) {
                shared.alert("Please input City!");
                return false;
            }

            if (!address.zip) {
                shared.alert("Please input Zipcode!");
                return false;
            }

            if (!address.street) {
                shared.alert("Please input Street!");
                return false;
            }

            return true;
        };
    });

