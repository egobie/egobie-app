angular.module('app.car', ['ionic', 'util.shared', 'util.url'])

    .config(function($stateProvider) {
        $stateProvider
            .state('menu.car', {
                url: '/car',
                views: {
                    'side-menu': {
                        templateUrl: 'templates/car/car.html'
                    }
                }
            });
    })

    .controller('carCtrl', function($scope, $ionicModal, $ionicPopup, $ionicActionSheet, $http, shared, url) {
        shared.goCar();

        $scope.cars = shared.getUserCars();
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
                titleText: 'Manage Vehicle',

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
                    
                }
            });
        };

        $ionicModal.fromTemplateUrl('templates/car/add.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.addCarModal = modal;
        });

        $scope.showAddCar = function() {
            $scope.addCarModal.show();
        };

        $ionicModal.fromTemplateUrl('templates/car/edit.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.editCarModal = modal;
        });

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

        $scope.deleteCar = function(id) {
            $ionicPopup.confirm({
                title: "Are you sure to delete this car?"
            }).then(function(sure) {
                shared.showLoading();
                if (sure) {
                    $http
                        .post(url.deleteCar, shared.getRequestBody({
                            id: id
                        }))
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

        $scope.noCar = function() {
            return Object.keys($scope.cars).length === 0;
        };
    });
