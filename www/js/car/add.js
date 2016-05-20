angular.module('app.car.add', ['ionic', 'util.shared', 'util.url'])

    .controller('carAddCtrl', function($scope, $http, shared, url) {
        $scope.makers = shared.getCarMakers();
        $scope.years = shared.getYears();
        $scope.states = shared.getStates();
        $scope.colors = shared.getColors();
        $scope.models = [];

        $scope.selected = {
            id: 0,
            plate: "",
            year: 0,
            state: "",
            maker: 0,
            model: 0,
            color: ""
        };

        $scope.hideAddCar = function() {
            clearSelected();
            $scope.addCarModal.hide();
        };

        $scope.changeMaker = function() {
            $scope.selected.model = 0;
            $scope.models = shared.getCarModels($scope.selected.maker);
        };

        $scope.createCar = function() {
            var newCar = {
                plate: $scope.selected.plate.toUpperCase(),
                state: $scope.selected.state,
                year: $scope.selected.year,
                color: $scope.selected.color,
                maker: $scope.selected.maker,
                model: $scope.selected.model
            };

            if (!validateCar(newCar)) {
                return;
            }

            shared.showLoading();

            $http
                .post(url.newCar, shared.getRequestBody(newCar))
                .success(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.addUserCar(data);
                    $scope.hideAddCar();
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
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
                shared.alert("Please choose the maker!");
                return false;
            }

            if (!car.model) {
                shared.alert("Please choose the model!");
                return false;
            }

            return true;
        };
    });