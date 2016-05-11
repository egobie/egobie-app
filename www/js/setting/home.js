angular.module('app.setting.home', ['ionic', 'util.shared', 'util.url'])

    .controller('homeEditCtrl', function($scope, $http, shared, url) {
        $scope.states = shared.getStates();
        $scope.home = {
            state: shared.getUser().home_state,
            city: shared.getUser().home_city,
            zip: shared.getUser().home_zip,
            street: shared.getUser().home_street
        };

        $scope.hideEditHome = function() {
            $scope.editHomeModal.hide();
            $scope.editHomeModal.remove();
        };

        $scope.editHome = function() {
            var address = {
                user_id: shared.getUser().id,
                user_token: shared.getUser().token,
                state: $scope.home.state,
                city: $scope.home.city,
                zip: $scope.home.zip,
                street: $scope.home.street
            };

            if (!validateAddress(address)) {
                return;
            }

            shared.showLoading();

            $http
                .post(url.updateHome, address, {
                    headers: shared.getHeaders()
                })
                .success(function(data, status, hearders, config) {
                    shared.refreshHome(address);
                    shared.hideLoading();
                    $scope.hideEditHome();
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

