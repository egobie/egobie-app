angular.module('app.car.edit', ['ionic', 'util.shared', 'util.url'])

    .controller('carEditCtrl', function($scope, $http, shared, url) {
        $scope.makers = shared.getCarMakers();
        $scope.years = shared.getYears();
        $scope.states = shared.getStates();
        $scope.colors = shared.getColors();

        $scope.changeMaker = function() {
            $scope.selected.model = 0;
            $scope.models = shared.getCarModels($scope.selected.maker);
        };

        $scope.editCar = function() {
            var car = {
                id:  $scope.selected.id,
                plate: $scope.selected.plate.toUpperCase(),
                state: $scope.selected.state,
                year: $scope.selected.year,
                color: $scope.selected.color,
                maker: $scope.selected.maker,
                model: $scope.selected.model
            };

            if (!validateCar(car)) {
                return;
            }

            shared.showLoading();

            $http
                .post(url.editCar, shared.getRequestBody(car))
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.addUserCar(data);
                    $scope.hideEditCar();
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.hideEditCar = function() {
            clearSelected();
            $scope.editCarModal.hide();
        };

        function clearSelected() {
            $scope.selected.plate = "";
            $scope.selected.state = "";
            $scope.selected.year = 0;
            $scope.selected.maker = 0;
            $scope.selected.model = 0;
            $scope.selected.color = "";
        };

        function validateCar(car) {
            if (!car.plate) {
                shared.alert("Please input the plate!");
                return false;
            }

            if (!car.state) {
                shared.alert("Please choose the state!");
                return false;
            }

            if (!car.year) {
                shared.alert("Please choose the year!");
                return false;
            }

            if (!car.color) {
                shared.alert("Please choose the color!");
                return false;
            }

            if (!car.maker) {
                shared.alert("Please choose the make!");
                return false;
            }

            if (!car.model) {
                shared.alert("Please choose the model!");
                return false;
            }

            return true;
        };
    });