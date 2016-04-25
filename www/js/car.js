angular.module('app.car', ['ionic', 'util.shared', 'util.url'])

    .config(function($stateProvider) {
        $stateProvider
            .state('menu.car', {
                url: '/car',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/menu/car.html'
                    }
                }
            });
    })

    .controller('carCtrl', function($scope, $ionicModal, $ionicPopup, $ionicActionSheet, $http, shared, url) {
        $scope.cars = shared.getUserCars();
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

        $scope.showCarActionSheet = function(car) {
            $scope.hideCarActionSheet = $ionicActionSheet.show({
                titleText: 'Actions',

                buttons: [
                    { text: 'Edit' }
                ],
                buttonClicked: function(index) {
                    $scope.hideCarActionSheet();

                    if (index === 0) {
                        $scope.showEditCar(car);
                    }
                },

                destructiveText: 'Delete',
                destructiveButtonClicked: function() {
                    $scope.deleteCar(car.id);
                },

                cancelText: 'Cancel',
                cancel: function() {
                    console.log('Cancel');
                }
            });
        };

        $ionicModal.fromTemplateUrl('add-car', {
            scope: $scope
        }).then(function(modal) {
            $scope.addCarModal = modal;
        });

        $ionicModal.fromTemplateUrl('edit-car', {
            scope: $scope
        }).then(function(modal) {
            $scope.editCarModal = modal;
        });

        $scope.showAddCar = function() {
            $scope.addCarModal.show();
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
                user_id: shared.getUser().id,
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

            console.log(newCar);
            shared.showLoading();

            $http
                .post(url.newCar, newCar, {
                    headers: shared.getHeaders()
                })
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

        $scope.showEditCar = function(car) {
            $scope.models = shared.getCarModels(car.maker_id);

            $scope.selected.id = car.id;
            $scope.selected.plate = car.plate;
            $scope.selected.state = car.state;
            $scope.selected.year = car.year;
            $scope.selected.maker = car.maker_id;
            $scope.selected.model = car.model_id;
            $scope.selected.color = car.color;

            $scope.editCarModal.show();
        };

        $scope.editCar = function() {
            var car = {
                id:  $scope.selected.id,
                user_id: shared.getUser().id,
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

            console.log(car);
            shared.showLoading();

            $http
                .post(url.editCar, car, {
                    headers: shared.getHeaders()
                })
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

        $scope.deleteCar = function(id) {
            $ionicPopup.confirm({
                title: "Are you sure to delete this car?"
            }).then(function(sure) {
                shared.showLoading();
                if (sure) {
                    $http
                        .post(url.deleteCar, {
                            id: id,
                            user_id: shared.getUser().id
                        }, {
                            headers: shared.getHeaders()
                        })
                        .success(function(data, status, headers, config) {
                            shared.hideLoading();
                            shared.deleteUserCar(id);
                            $scope.hideCarActionSheet();
                        })
                        .error(function(data, status, headers, config) {
                            shared.hideLoading();
                            shared.alert(data);
                            $scope.hideCarActionSheet();
                        });
                }
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
                $ionicPopup.alert({
                    title: "Please input the plate!"
                });
                return false;
            }

            if (!car.state) {
                $ionicPopup.alert({
                    title: "Please choose the state!"
                });
                return false;
            }

            if (!car.year) {
                $ionicPopup.alert({
                    title: "Please choose the year!"
                });
                return false;
            }

            if (!car.color) {
                $ionicPopup.alert({
                    title: "Please choose the color!"
                });
                return false;
            }

            if (!car.maker) {
                $ionicPopup.alert({
                    title: "Please choose the maker!"
                });
                return false;
            }

            if (!car.model) {
                $ionicPopup.alert({
                    title: "Please choose the model!"
                });
                return false;
            }

            return true;
        };

    });
