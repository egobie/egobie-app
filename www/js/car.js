angular.module('app.car', ['ionic', 'util.shared', 'util.url'])

    .service('getUserCars', function($http, shared, url) {
        shared.showLoading();

        var userCars = null;
        var promise = $http
            .post(url.cars, {
                user_id: shared.getUser().id
            }, {
                headers: shared.getHeaders()
            })
            .success(function(data, status, headers, config) {
                shared.hideLoading();
                userCars = data;
            })
            .error(function(data, status, headers, config) {
                shared.hideLoading();
                shared.alert(data);
            });

        return {
            promise: promise,
            getData: function() {
                return userCars;
            }
        };
    })

    .service('getCarMakers', function($http, shared, url) {
        var carMakers = null;
        var promise = $http
            .get(url.carMaker, {
                headers: shared.getHeaders()
            })
            .success(function(data, status, headers, config) {
                carMakers = data;
            })
            .error(function(data, status, headers, config) {
                shared.alert(data);
            });

        return {
            promise: promise,
            getData: function() {
                return carMakers;
            }
        };
    })

    .config(function($stateProvider) {
        $stateProvider
            .state('menu.car', {
                url: '/car',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/menu/car.html'
                    }
                },
                resolve: {
                    'ResolveUserCars': function(getUserCars) {
                        return getUserCars.promise;
                    },
                    'ResolveCarMakers': function(getCarMakers) {
                        return getCarMakers.promise;
                    }
                }
            });
    })

    .controller('carCtrl', function($scope, $ionicModal, $ionicPopup, $ionicActionSheet, $http, getUserCars, getCarMakers, shared, url) {
        var cars = getUserCars.getData();

        $scope.cars = {};
        $scope.makers = getCarMakers.getData();
        $scope.years = shared.getYears();
        $scope.states = shared.getStates();
        $scope.colors = shared.getColors();
        $scope.models = [];

        for (var i = 0; cars && i < cars.length; i++) {
            $scope.cars[cars[i].id] = cars[i];
        }

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
            shared.showLoading();
            $scope.selected.model = 0;

            if ($scope.selected.maker) {
                $http
                    .get(url.carModel + "/" + $scope.selected.maker, {
                        headers: shared.getHeaders()
                    })
                    .success(function(data, status, headers, config) {
                        shared.hideLoading();
                        $scope.models = data;
                    })
                    .error(function(data, status, headers, config) {
                        shared.hideLoading();
                        shared.alert(data);
                    });
            } else {
                $scope.models = [];
            }
        };

        $scope.addCar = function(car) {
            $scope.cars[car.id] = car;
        },

        $scope.removeCar = function(id) {
            delete $scope.cars[id];
        },

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
                    $scope.addCar(data);
                    $scope.hideAddCar();
                })
                .error(function(data, status, headers, config) {
                    shared.hideLoading();
                    shared.alert(data);
                });
        };

        $scope.showEditCar = function(car) {
            $scope.selected.id = car.id;

            $http
                .get(url.carModel + "/" + car.maker_id, {
                    headers: shared.getHeaders()
                })
                .success(function(data, status, headers, config) {
                    $scope.models = data;
                    $scope.selected.plate = car.plate;
                    $scope.selected.state = car.state;
                    $scope.selected.year = car.year;
                    $scope.selected.maker = car.maker_id;
                    $scope.selected.model = car.model_id;
                    $scope.selected.color = car.color;

                    $scope.editCarModal.show();
                    console.log($scope.selected);
                })
                .error(function(data, status, headers, config) {
                    shared.alert(data);
                });
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
                    $scope.addCar(data);
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
                            $scope.removeCar(id);
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
